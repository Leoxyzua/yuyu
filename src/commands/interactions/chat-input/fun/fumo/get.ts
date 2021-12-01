import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseSubCommand } from "../../../basecommand"
import { Commands } from "../../../../../utils/parameters"
import { Error } from "../../../../../utils/icons"

export const COMMAND_NAME = "get"

export class FumoGetCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Obten un fumo de la Fumo Api mediante su ID."

    constructor() {
        super({
            options: [{
                name: 'id',
                label: 'fumo',
                description: 'La ID del fumo',
                required: true,
                value: Commands.Fumo.fumoClient.cache.get.bind(Commands.Fumo.fumoClient)
            }]
        })
    }

    onBeforeRun(context: InteractionContext, args: Commands.Fumo.arguments.get) {
        return !!args.fumo
    }

    onCancelRun(context: InteractionContext) {
        return this.safeReply(
            context,
            `${Error} Fumo no encontrado, asegurate de haber ingresado una ID válida.`,
            true
        )
    }

    run(context: InteractionContext, args: Commands.Fumo.arguments.get) {
        return Commands.Fumo.get(context, args)
    }
}