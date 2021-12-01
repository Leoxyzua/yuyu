import { Interaction } from "detritus-client"
import { Commands } from "../../../utils/parameters"
import { BaseCommand } from "../basecommand"

export const COMMAND_NAME = 'ping'

export default class PingCommand extends BaseCommand<unknown> {
    name = COMMAND_NAME
    description = "Pong!"

    constructor() {
        super({
            metadata: { category: 'misc' }
        })
    }

    async run(context: Interaction.InteractionContext) {
        return Commands.ping(context)
    }
}