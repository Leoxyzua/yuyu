import { BaseCommand } from "../../../basecommand"

import { FumoGetCommand } from "./get"
import { FumoRandomCommand } from "./random"
import { FumoListCommand } from "./list"
import { FumoRedditCommand } from "./reddit"

export const COMMAND_NAME = "fumo"

export default class FumoCommands extends BaseCommand {
    public name = COMMAND_NAME
    public description = "."

    public constructor() {
        super({
            options: [
                new FumoGetCommand(),
                new FumoRandomCommand(),
                new FumoListCommand(),
                new FumoRedditCommand()
            ],
            metadata: { category: 'fun' }
        })
    }
}