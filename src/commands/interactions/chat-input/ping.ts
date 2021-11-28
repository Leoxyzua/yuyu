import { Interaction } from "detritus-client"
import { BaseCommand } from "../basecommand"

export const COMMAND_NAME = 'ping'

export default class PingCommand extends BaseCommand<unknown> {
    name = COMMAND_NAME
    description = "Pong! :D"

    constructor() {
        super({
            metadata: { category: 'misc' }
        })
    }

    async run(context: Interaction.InteractionContext) {
        const pings: { [key: string]: number } = await context.client.ping()

        const text = Object.keys(pings)
            .map((ping) => `${ping}: ${pings[ping]} ms`)
            .join(', ')

        return context.editOrRespond(`pong! 🏓\n\n${text}`)
    }
}