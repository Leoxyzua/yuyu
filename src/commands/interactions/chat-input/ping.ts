import { Interaction } from "detritus-client";
import { BaseCommand } from "../basecommand";

export default class PingCommand extends BaseCommand<unknown> {
    name = 'ping';
    description = "Pong! :D";

    constructor() {
        super({
            metadata: { category: 'misc' }
        });
    }

    async run(context: Interaction.InteractionContext) {
        const pings: { [key: string]: number } = await context.client.ping();

        const text = Object.keys(pings)
            .map((ping) => `${ping}: ${pings[ping]} ms`)
            .join(', ');

        return context.editOrRespond(`pong! 🏓\n\n${text}`);
    }
}