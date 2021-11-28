import { Interaction, Structures } from "detritus-client"
import { InteractionCallbackTypes, MessageFlags } from "detritus-client/lib/constants"
import { CommandValues } from "../../../../../utils/parameters"
import { BaseSubCommand } from "../../../basecommand"

export const COMMAND_NAME = 'delete'

export interface CommandArgsBefore {
    emojis: Structures.Emoji[] | false
}

export interface CommandArgs {
    emojis: Structures.Emoji[]
}

export class DeleteEmojiCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Borra un emoji del servidor."

    constructor() {
        super({
            options: [{
                name: 'emoji',
                label: 'emojis',
                description: 'Los/el nombre(s) de el/los emoji(s)',
                required: true,
                value: CommandValues.parseEmojisToDelete,
            }]
        })
    }

    onBeforeRun(_context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.emojis
    }

    onCancelRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        if (args.emojis === false) {
            return context.editOrRespond({
                content: `No pude encontrar ningun emoji.`,
                flags: MessageFlags.EPHEMERAL
            })
        }
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

        const result = args.emojis.map((emoji) => emoji.delete({
            reason: `Moderador responsable: ${context.user.tag}`
        }).catch(() => undefined))

        return context.editOrRespond(`Borré correctamente **${result.length}** emoji(s)!`)
    }
}