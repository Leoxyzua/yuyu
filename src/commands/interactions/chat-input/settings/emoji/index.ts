import { Permissions } from "detritus-client/lib/constants"
import { BaseCommand } from "../../../basecommand"
import { CreateEmojiCommands } from "./create"
import { DeleteEmojiCommand } from "./delete"
import { EmojiListCommand } from "./list"

export const COMMAND_NAME = "emoji"

export function parseEmojiName(str: string) {
    return str.replace(/[\W_]+/g, "_")
}

export default class EmojiCommands extends BaseCommand {
    public name = COMMAND_NAME
    public description = "."

    public constructor() {
        super({
            metadata: { category: 'settings' },
            options: [
                new CreateEmojiCommands(),
                new DeleteEmojiCommand(),
                new EmojiListCommand()
            ]
        })
    }

    public permissions = [Permissions.MANAGE_EMOJIS]
}