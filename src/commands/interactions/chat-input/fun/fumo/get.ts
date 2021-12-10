import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseSubCommand } from "../../../basecommand"
import { Commands } from "../../../../../utils/parameters"
import { Error } from "../../../../../utils/icons"

export const COMMAND_NAME = "get"

export class FumoGetCommand extends BaseSubCommand {
    public name = COMMAND_NAME
    public description = "Obten un fumo de la Fumo Api mediante su ID."

    public constructor() {
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

    public onBeforeRun(context: InteractionContext, args: Commands.Fumo.arguments.get) {
        return !!args.fumo
    }

    public onCancelRun(context: InteractionContext) {
        return this.safeReply(
            context,
            `${Error} Fumo no encontrado, asegurate de haber ingresado una ID válida.`,
            true
        )
    }

    public run(context: InteractionContext, args: Commands.Fumo.arguments.get) {
        return Commands.Fumo.get(context, args)
    }
}