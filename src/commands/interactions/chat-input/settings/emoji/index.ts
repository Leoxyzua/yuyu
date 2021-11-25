import { Constants } from "detritus-client";
import { BaseCommand } from "../../../basecommand";
import { CreateEmojiCommands } from "./create"
import { DeleteEmojiCommand } from "./delete";
import { EmojiListCommand } from "./list";

export const COMMAND_NAME = "emoji";

export function parseEmojiName(str: string) {
    return str.replace(/[\W_]+/g, "_")
}

export default class EmojiCommands extends BaseCommand {
    name = COMMAND_NAME;
    description = ".";

    constructor() {
        super({
            metadata: { category: 'settings' },
            options: [
                new CreateEmojiCommands(),
                new DeleteEmojiCommand(),
                new EmojiListCommand()
            ]
        })
    }

    permissions = [Constants.Permissions.MANAGE_EMOJIS]
}