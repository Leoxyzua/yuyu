import { Constants } from "detritus-client"
import { BaseCommand } from "../../../basecommand"

import { CreateBanCommand } from './create'
import { RemoveBanCommand } from "./remove"


export const COMMAND_NAME = "ban"

export default class BanCommands extends BaseCommand {
    name = COMMAND_NAME
    description = "."

    constructor() {
        super({
            metadata: { category: 'mod' },
            options: [
                new CreateBanCommand(),
                new RemoveBanCommand(),
            ]
        })
    }

    permissions = [Constants.Permissions.BAN_MEMBERS]
}