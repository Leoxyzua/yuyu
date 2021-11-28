import { BaseSubCommandGroup } from "../../../../basecommand.js"

import { CreateMultipleEmojisCommand } from "./multiple"
import { CreateOneEmojiCommand } from "./one"

export const COMMAND_NAME = "create"

export class CreateEmojiCommands extends BaseSubCommandGroup {
    name = COMMAND_NAME
    description = '.'

    constructor() {
        super({
            options: [
                new CreateOneEmojiCommand(),
                new CreateMultipleEmojisCommand()
            ]
        })
    }
}