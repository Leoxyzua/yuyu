import { Interaction, Utils } from "detritus-client"
import { MessageFlags } from "detritus-client/lib/constants"
import { BaseContextMenuMessageCommand, ContextMenuMessageArgs } from "../../basecommand"

export const COMMAND_NAME = "Raw Content"

export default class RawContentCommand extends BaseContextMenuMessageCommand {
    name = COMMAND_NAME

    async run(context: Interaction.InteractionContext, args: ContextMenuMessageArgs) {
        const { content } = args.message

        if (!content) return context.editOrRespond({
            content: 'El mensaje tiene que tener cotenido.',
            flags: MessageFlags.EPHEMERAL
        })

        const text = Utils.Markup.codeblock(content.replace(/```/gi, ''))
        return context.editOrRespond({
            content: text,
            flags: MessageFlags.EPHEMERAL
        })
    }
}