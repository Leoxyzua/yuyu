import { InteractionContext } from "detritus-client/lib/interaction"
import { Permissions } from "detritus-client/lib/constants"
import { Commands } from "../../../../utils/parameters"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = 'unarchive-all'

export default class UnarchiveAllThreadsCommand extends BaseCommand {
    public name = COMMAND_NAME
    public description = 'Des-archiva todos los hilos archivados.'

    public constructor() {
        super({
            metadata: { category: 'settings' },
            ratelimits: [{
                type: 'guild',
                duration: 10000,
                limit: 1
            }]
        })
    }

    public permissions = [
        Permissions.MANAGE_THREADS,
        Permissions.MANAGE_CHANNELS,
        Permissions.MANAGE_GUILD
    ]

    public async run(context: InteractionContext) {
        return Commands.unarchiveAll(context)
    }
}