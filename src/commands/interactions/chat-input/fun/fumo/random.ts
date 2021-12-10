import { InteractionContext } from "detritus-client/lib/interaction"
import { ComponentContext } from "detritus-client/lib/utils"
import { Commands } from "../../../../../utils/parameters"
import { BaseSubCommand } from "../../../basecommand"

export const COMMAND_NAME = "random"

export class FumoRandomCommand extends BaseSubCommand {
    public name = COMMAND_NAME
    public description = "Obten un fumo aleatorio de la Fumo Api"

    public run(context: InteractionContext | ComponentContext) {
        return Commands.Fumo.random(context)
    }
}