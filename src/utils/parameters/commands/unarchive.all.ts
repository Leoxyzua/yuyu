import { InteractionContext } from "detritus-client/lib/interaction"
import { InteractionCallbackTypes } from "detritus-client/lib/constants"
import { safeReply } from "../../tools"
import { Succes } from "../../icons"

export async function unarchiveAll(context: InteractionContext) {
    await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

    const start = Date.now()
    const unarchived: string[] = []

    for (const channel of context.guild?.channels.toArray()!) {
        const threadChannels = await channel.fetchThreadsArchivedPublic().catch(() => undefined)

        if (threadChannels && threadChannels.threads.length) {
            for (const thread of threadChannels.threads.toArray()) {
                if (thread.threadMetadata.archived) await thread.edit({ archived: false })
                    .catch(() => undefined).then(() => unarchived.push(thread.id))
            }
        }
    }

    return safeReply(
        context,
        `${Succes} Des-archive correctamente los siguientes threads: ${unarchived.length ? unarchived.map((id) => `<#${id}>`).join(', ') : 'Ninguno'}. En ${((Date.now() - start) / 1000).toFixed(1)}s`
    )
}