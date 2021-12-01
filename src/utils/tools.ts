import { Interaction, Utils, Structures, Constants } from "detritus-client"

export function safeReply(
    context: Interaction.InteractionContext | Utils.ComponentContext,
    content: Structures.InteractionEditOrRespond | string = {},
    ephemeral?: boolean
) {
    const flags = ephemeral
        ? Constants.MessageFlags.EPHEMERAL
        : typeof content !== 'string' && content.flags
            ? content.flags
            : undefined

    return context.editOrRespond({
        ...typeof content === 'string' ? { content } : content,
        flags,
        allowedMentions: { parse: [] }
    })
}

export function parseEmojiName(str: string) {
    return str.replace(/[\W_]+/g, "_")
}