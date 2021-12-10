import { Interaction } from "detritus-client"
import { Commands } from "../../../utils/parameters"
import { BaseCommand } from "../basecommand"

export const COMMAND_NAME = 'ping'

export default class PingCommand extends BaseCommand<unknown> {
    public name = COMMAND_NAME
    public description = "Pong!"

    public constructor() {
        super({
            metadata: { category: 'misc' }
        })
    }

    public async run(context: Interaction.InteractionContext) {
        return Commands.ping(context)
    }
}