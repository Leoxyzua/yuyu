import { BaseSubCommandGroup } from "../../../../basecommand.js"

import { CreateMultipleEmojisCommand } from "./multiple"
import { CreateOneEmojiCommand } from "./one"

export const COMMAND_NAME = "create"

export class CreateEmojiCommands extends BaseSubCommandGroup {
    public name = COMMAND_NAME
    public description = '.'

    public constructor() {
        super({
            options: [
                new CreateOneEmojiCommand(),
                new CreateMultipleEmojisCommand()
            ]
        })
    }
}