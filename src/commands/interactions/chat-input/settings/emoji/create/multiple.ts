import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseSubCommand } from "../../../../basecommand"
import { Commands, CommandValues } from "../../../../../../utils/parameters"

export const COMMAND_NAME = 'multiple'

export class CreateMultipleEmojisCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Crea multiples emojis."

    constructor() {
        super({
            options: [{
                name: 'emojis',
                description: 'Los emojis a añadir',
                required: true,
                value: CommandValues.parseEmojisToAdd
            }]
        })
    }

    onBeforeRun(_context: InteractionContext, args: Commands.Emoji.argumentsBefore.createMultiple) {
        return !!args.emojis
    }

    onCancelRun(context: InteractionContext, args: Commands.Emoji.argumentsBefore.createMultiple) {
        if (args.emojis === false) {
            return this.safeReply(context, `No pude encontrar ningun emoji.`, true)
        }
    }

    async run(context: InteractionContext, args: Commands.Emoji.arguments.createMultiple) {
        return Commands.Emoji.createMultiple(context, args)
    }
}