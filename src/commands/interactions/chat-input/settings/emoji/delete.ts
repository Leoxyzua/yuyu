import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands, CommandValues } from "../../../../../utils/parameters"
import { BaseSubCommand } from "../../../basecommand"

export const COMMAND_NAME = 'delete'

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

    onBeforeRun(_context: InteractionContext, args: Commands.Emoji.argumentsBefore._delete) {
        return !!args.emojis
    }

    onCancelRun(context: InteractionContext, args: Commands.Emoji.argumentsBefore._delete) {
        if (args.emojis === false) {
            return this.safeReply(context, `No pude encontrar ningun emoji.`, true)
        }
    }

    async run(context: InteractionContext, args: Commands.Emoji.arguments._delete) {
        return Commands.Emoji._delete(context, args)
    }
}