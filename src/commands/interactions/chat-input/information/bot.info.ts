import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands } from "../../../../utils/parameters"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = "me"

export default class BotInfoCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "Sobre mí"

    constructor() {
        super({
            metadata: { category: 'info' }
        })
    }

    async run(context: InteractionContext) {
        return Commands.botInfo(context)
    }
}