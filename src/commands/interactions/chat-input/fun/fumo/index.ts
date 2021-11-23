import { BaseCommand } from "../../../basecommand";
import { FumoClient } from "fumo-api";
import { FumoGetCommand } from "./get";
import { FumoRandomCommand } from "./random";

export const Client = new FumoClient(true);
export const COMMAND_NAME = "fumo";

export default class FumoCommands extends BaseCommand {
    name = COMMAND_NAME;
    description = ".";

    constructor() {
        super({
            options: [
                new FumoGetCommand(),
                new FumoRandomCommand()
            ],
            metadata: { category: 'fun' }
        });
    }
}