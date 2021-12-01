import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands } from "../../../../../utils/parameters"
import { BaseSubCommand } from "../../../basecommand"

export const COMMAND_NAME = "list"

export class FumoListCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Lista de todos los fumos en la Fumo Api"
    async run(context: InteractionContext) {
        return Commands.Fumo.list(context)
    }
}