import { BaseCommand } from "../../../basecommand"
import { FumoClient } from "fumo-api"

import { FumoGetCommand } from "./get"
import { FumoRandomCommand } from "./random"
import { FumoListCommand } from "./list"
import { FumoRedditCommand } from "./reddit"

export const Client = new FumoClient()
export const COMMAND_NAME = "fumo"

export default class FumoCommands extends BaseCommand {
    name = COMMAND_NAME;
    description = ".";

    constructor() {
        super({
            options: [
                new FumoGetCommand(),
                new FumoRandomCommand(),
                new FumoListCommand(),
                new FumoRedditCommand()
            ],
            metadata: { category: 'fun' }
        });
    }
}