import { Interaction, Constants, Utils, Structures } from "detritus-client";
import { PermissionUnRaw, Servers } from "../../utils/constants";
import { Warning, Error } from "../../utils/icons";

import { inspect } from 'util';

const { bold, codeblock } = Utils.Markup;

export class BaseCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    onRunError(context: Interaction.InteractionContext, _args: unknown, error: any) {
        if (error.raw && error.response) console.error(`Error in the command ${this.name}`, inspect(error.raw, { depth: 7 }));
        else console.error(error);

        return context.editOrRespond({
            content: `${Error} Ocurrió un error al ejecutar este comando:\n${codeblock(error.toString())}`,
            flags: Constants.MessageFlags.EPHEMERAL,
        });
    }

    onError(context: Interaction.InteractionContext, _args: unknown, error: any) {
        return this.onRunError(context, _args, error);
    }

    onLoadingTrigger(context: Interaction.InteractionContext) {
        if (context.responded) return;

        return context.respond(Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, {
            flags: this.triggerLoadingAsEphemeral ? Constants.MessageFlags.EPHEMERAL : undefined
        });
    }

    async onRatelimit(context: Interaction.InteractionContext, ratelimits: Array<Interaction.CommandRatelimitInfo>,) {
        for (const { ratelimit, remaining } of ratelimits) {
            const texts: { [key: string]: (seconds: string) => string } = {
                user: (seconds) => `${Warning} Estas usando comandos demasiado rapido, espera ${bold(seconds)} segundos.`,
                channel: (seconds) => `${Warning} Estan usando comandos demasiado rapido en este canal, esperen ${bold(seconds)} segundos.`
            }

            const type = ratelimit.type.toString();

            return context.editOrRespond({
                content: texts[type]((remaining / 1000).toFixed(1)) ?? 'Oops',
                flags: type === 'user' ? Constants.MessageFlags.EPHEMERAL : undefined
            });
        }
    }

    onPermissionsFail(context: Interaction.InteractionContext, failed: Array<bigint>) {
        const permissions: Array<string> = [];
        for (const permission of failed) {
            const key = String(permission);
            permissions.push(PermissionUnRaw[key]);
        }

        return context.editOrRespond({
            content: `${Error} Para ejecutar el comando ${this.name} necesitas el/los siguiente(s) permiso(s):\n${Utils.Markup.codeblock(permissions.join(', '))}`,
            flags: Constants.MessageFlags.EPHEMERAL,
        });
    }

    constructor(data: Interaction.InteractionCommandOptions = {}) {
        super(Object.assign({
            defaultPermission: !['mod', 'config'].includes(data.metadata?.category),
            guildIds: Servers,
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
        }, data));
    }
}

export class BaseSubCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = Constants.ApplicationCommandOptionTypes.SUB_COMMAND;
}

export class BaseSubCommandGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}

export interface ContextMenuMessageArgs {
    message: Structures.Message,
}

export class BaseContextMenuMessageCommand extends BaseCommand<ContextMenuMessageArgs> {
    type = Constants.ApplicationCommandTypes.MESSAGE;
    triggerLoadingAfter = 1000;
    triggerLoadingAsEphemeral = true;
}

export interface ContextMenuUserArgs {
    member?: Structures.Member,
    user: Structures.User,
}

export class BaseContextMenuUserCommand extends BaseCommand<ContextMenuUserArgs> {
    type = Constants.ApplicationCommandTypes.USER;
    triggerLoadingAfter = 1000;
    triggerLoadingAsEphemeral = true;
}