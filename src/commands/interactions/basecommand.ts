import { Interaction, Utils } from "detritus-client"
import {
    MessageFlags,
    InteractionCallbackTypes,
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes
} from "detritus-client/lib/constants"
import { Member, User, Message, InteractionEditOrRespond } from "detritus-client/lib/structures"
import { PermissionUnRaw, Servers, TestServers } from "../../utils/constants"
import { Warning, Error } from "../../utils/icons"
import { inspect } from 'util'
const { bold, codeblock } = Utils.Markup

export class BaseCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    safeReply(
        context: Interaction.InteractionContext,
        content: InteractionEditOrRespond | string = {},
        ephemeral?: boolean
    ) {
        const flags = ephemeral
            ? MessageFlags.EPHEMERAL
            : typeof content !== 'string' && content.flags
                ? content.flags
                : undefined

        return context.editOrRespond({
            ...typeof content === 'string' ? { content } : content,
            flags
        })
    }

    onRunError(context: Interaction.InteractionContext, _args: unknown, error: any) {
        if (error.raw && error.response) console.error(`Error in the command ${this.name}`, inspect(error.raw, { depth: 7 }))
        else console.error(error)

        return this.safeReply(
            context,
            `${Error} Ocurrió un error al ejecutar este comando:\n${codeblock(error.toString())}`,
            true
        )
    }

    onError(context: Interaction.InteractionContext, _args: unknown, error: any) {
        return this.onRunError(context, _args, error)
    }

    onLoadingTrigger(context: Interaction.InteractionContext) {
        if (context.responded) return

        return context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, {
            flags: this.triggerLoadingAsEphemeral ? MessageFlags.EPHEMERAL : undefined
        })
    }

    async onRatelimit(context: Interaction.InteractionContext, ratelimits: Array<Interaction.CommandRatelimitInfo>,) {
        for (const { ratelimit, remaining } of ratelimits) {
            const texts: { [key: string]: (seconds: string) => string } = {
                user: (seconds) => `${Warning} Estas usando comandos demasiado rapido, espera ${bold(seconds)} segundos.`,
                channel: (seconds) => `${Warning} Estan usando comandos demasiado rapido en este canal, esperen ${bold(seconds)} segundos.`
            }

            const type = ratelimit.type.toString()

            return this.safeReply(
                context,
                texts[type]((remaining / 1000).toFixed(1)) ?? 'Oops',
                type === 'user'
            )
        }
    }

    onPermissionsFail(context: Interaction.InteractionContext, failed: Array<bigint>) {
        const permissions: Array<string> = []
        for (const permission of failed) {
            const key = String(permission)
            permissions.push(PermissionUnRaw[key])
        }

        return this.safeReply(
            context,
            `${Error} Para ejecutar el comando ${this.name} necesitas el/los siguiente(s) permiso(s):\n${Utils.Markup.codeblock(permissions.join(', '))}`,
            true
        )
    }

    constructor(data: Interaction.InteractionCommandOptions = {}) {
        super(Object.assign({
            defaultPermission: process.env.mode === 'development' ? !['mod', 'config'].includes(data.metadata?.category) : true,
            guildIds: process.env.mode === 'development' ? Servers : TestServers,
            ratelimits: [
                {
                    duration: 2000,
                    limit: 1,
                    type: 'user'
                },
                {
                    duration: 3000,
                    limit: 3,
                    type: 'channel'
                },
            ],
        }, data))
    }
}

export class BaseSubCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND
}

export class BaseSubCommandGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
}

export interface ContextMenuMessageArgs {
    message: Message
}

export class BaseContextMenuMessageCommand extends BaseCommand<ContextMenuMessageArgs> {
    type = ApplicationCommandTypes.MESSAGE
    triggerLoadingAfter = 1000
    triggerLoadingAsEphemeral = true
}

export interface ContextMenuUserArgs {
    member?: Member
    user: User
}

export class BaseContextMenuUserCommand extends BaseCommand<ContextMenuUserArgs> {
    type = ApplicationCommandTypes.USER
    triggerLoadingAfter = 1000
    triggerLoadingAsEphemeral = true
}