import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands } from "../../../../utils/parameters"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = "me"

export default class BotInfoCommand extends BaseCommand {
    public name = COMMAND_NAME
    public description = "Sobre mí"

    public constructor() {
        super({
            metadata: { category: 'info' }
        })
    }

    public async run(context: InteractionContext) {
        return Commands.botInfo(context)
    }
}