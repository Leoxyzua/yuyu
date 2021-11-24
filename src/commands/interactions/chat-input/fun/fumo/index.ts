import { BaseCommand } from "../../../basecommand";
import { FumoClient } from "fumo-api";
import { FumoGetCommand } from "./get";
import { FumoRandomCommand } from "./random";
import { FumoListCommand } from "./list";

export const Client = new FumoClient(true);
export const COMMAND_NAME = "fumo";

export default class FumoCommands extends BaseCommand {
    name = COMMAND_NAME;
    description = ".";

    constructor() {
        super({
            options: [
                new FumoGetCommand(),
                new FumoRandomCommand(),
                new FumoListCommand()
            ],
            metadata: { category: 'fun' }
        });
    }
}