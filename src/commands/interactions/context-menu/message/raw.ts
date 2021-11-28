import { Interaction, Utils } from "detritus-client"
import { MessageFlags } from "detritus-client/lib/constants"
import { BaseContextMenuMessageCommand, ContextMenuMessageArgs } from "../../basecommand"

export const COMMAND_NAME = "Raw Content"

export default class RawContentCommand extends BaseContextMenuMessageCommand {
    name = COMMAND_NAME

    async run(context: Interaction.InteractionContext, args: ContextMenuMessageArgs) {
        const { content } = args.message

        if (!content)
            return this.safeReply(context, 'El mensaje tiene que tener cotenido.', true)

        const text = Utils.Markup.codeblock(content.replace(/```/gi, ''))
        return this.safeReply(context, text, true)
    }
}