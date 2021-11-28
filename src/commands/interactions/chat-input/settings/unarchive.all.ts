import { Interaction } from "detritus-client"
import { InteractionCallbackTypes, Permissions } from "detritus-client/lib/constants"
import { Succes } from "../../../../utils/icons"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = 'unarchive-all'

export default class UnarchiveAllThreadsCommand extends BaseCommand {
    name = COMMAND_NAME
    description = 'Des-archiva todos los hilos archivados.'

    constructor() {
        super({
            metadata: { category: 'settings' },
            ratelimits: [{
                type: 'guild',
                duration: 10000,
                limit: 1
            }]
        })
    }

    permissions = [
        Permissions.MANAGE_THREADS,
        Permissions.MANAGE_CHANNELS,
        Permissions.MANAGE_GUILD
    ]

    async run(context: Interaction.InteractionContext) {
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

        return this.safeReply(
            context,
            `${Succes} Des-archive correctamente los siguientes threads: ${unarchived.length ? unarchived.map((id) => `<#${id}>`).join(', ') : 'Ninguno'}. En ${((Date.now() - start) / 1000).toFixed(1)}s`
        )
    }
}