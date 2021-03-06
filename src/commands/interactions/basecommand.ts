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
import { safeReply } from "../../utils/tools"
import { Logger } from "@dimensional-fun/logger"
const { bold, codeblock } = Utils.Markup

export class BaseCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    public logger = new Logger("commands")

    public safeReply(
        context: Interaction.InteractionContext | Utils.ComponentContext,
        content: InteractionEditOrRespond | string = {},
        ephemeral?: boolean
    ) {
        return safeReply(context, content, ephemeral)
    }

    public onRunError(context: Interaction.InteractionContext, _args: unknown, error: any) {
        if (error.raw && error.response) this.logger.error(inspect(error.raw, { depth: 7 }))
        else this.logger.error(error)

        return this.safeReply(
            context,
            codeblock(error.toString()),
            true
        )
    }

    public onError(context: Interaction.InteractionContext, _args: unknown, error: any) {
        return this.onRunError(context, _args, error)
    }

    public onLoadingTrigger(context: Interaction.InteractionContext) {
        if (context.responded) return

        return context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, {
            flags: this.triggerLoadingAsEphemeral ? MessageFlags.EPHEMERAL : undefined
        })
    }

    public async onRatelimit(context: Interaction.InteractionContext, ratelimits: Array<Interaction.CommandRatelimitInfo>,) {
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

    public onPermissionsFail(context: Interaction.InteractionContext, failed: Array<bigint>) {
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

    public constructor(data: Interaction.InteractionCommandOptions = {}) {
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
    public type = ApplicationCommandOptionTypes.SUB_COMMAND
    public safeReply(
        context: Interaction.InteractionContext | Utils.ComponentContext,
        content: InteractionEditOrRespond | string = {},
        ephemeral?: boolean
    ) {
        return safeReply(context, content, ephemeral)
    }
}

export class BaseSubCommandGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    public type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
    public safeReply(
        context: Interaction.InteractionContext | Utils.ComponentContext,
        content: InteractionEditOrRespond | string = {},
        ephemeral?: boolean
    ) {
        return safeReply(context, content, ephemeral)
    }
}

export interface ContextMenuMessageArgs {
    message: Message
}

export class BaseContextMenuMessageCommand extends BaseCommand<ContextMenuMessageArgs> {
    public type = ApplicationCommandTypes.MESSAGE
    public triggerLoadingAfter = 1000
    public triggerLoadingAsEphemeral = true
    public metadata = { category: 'context-menu' }
}

export interface ContextMenuUserArgs {
    member?: Member
    user: User
}

export class BaseContextMenuUserCommand extends BaseCommand<ContextMenuUserArgs> {
    public type = ApplicationCommandTypes.USER
    public triggerLoadingAfter = 1000
    public triggerLoadingAsEphemeral = true
    public metadata = { category: 'context-menu' }
}