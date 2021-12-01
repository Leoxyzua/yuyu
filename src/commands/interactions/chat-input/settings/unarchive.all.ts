import { InteractionContext } from "detritus-client/lib/interaction"
import { Permissions } from "detritus-client/lib/constants"
import { Commands } from "../../../../utils/parameters"
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

    async run(context: InteractionContext) {
        return Commands.unarchiveAll(context)
    }
}