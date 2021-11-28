import { BaseSubCommand } from "../../../basecommand"
import { FumoData } from "fumo-api"
import { Client } from "."
import { Constants, Interaction } from "detritus-client"
import { Error } from "../../../../../utils/icons"

export interface CommandArgsBefore {
    fumo: FumoData | undefined
}

export interface CommandArgs {
    fumo: FumoData
}

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
                value: Client.cache.get.bind(Client)
            }]
        })
    }

    onBeforeRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.fumo
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return this.safeReply(
            context,
            `${Error} Fumo no encontrado, asegurate de haber ingresado una ID válida.`,
            true
        )
    }

    run(context: Interaction.InteractionContext, { fumo: { URL } }: CommandArgs) {
        return this.safeReply(context, URL)
    }
}