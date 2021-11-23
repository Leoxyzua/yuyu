import { BaseSubCommand } from "../../../basecommand";
import { FumoData } from "fumo-api";
import { Client } from ".";
import { Constants, Interaction } from "detritus-client";
import { Error } from "../../../../../utils/icons";

export interface CommandArgsBefore {
    fumo: FumoData | undefined;
}

export interface CommandArgs {
    fumo: FumoData;
}

export const COMMAND_NAME = "get";

export class FumoGetCommand extends BaseSubCommand {
    name = COMMAND_NAME;
    description = "Obten un fumo de la Fumo Api mediante su ID."

    constructor() {
        super({
            options: [{
                name: 'id',
                label: 'fumo',
                description: 'La ID del fumo',
                required: true,
                value: (input: string) => {
                    return Client.cache.get(input);
                }
            }]
        });
    }

    onBeforeRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.fumo;
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: `${Error} Fumo no encontrado, asegurate de haber ingresado una ID válida.`,
            flags: Constants.MessageFlags.EPHEMERAL
        });
    }

    run(context: Interaction.InteractionContext, { fumo: { URL } }: CommandArgs) {
        return context.editOrRespond(URL);
    }
}