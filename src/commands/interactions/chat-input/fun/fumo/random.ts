import { BaseSubCommand } from "../../../basecommand";
import { Client } from ".";
import { Interaction, Utils } from "detritus-client";
import { Colors } from "../../../../../utils/constants";

export const COMMAND_NAME = "random";

export class FumoRandomCommand extends BaseSubCommand {
    name = COMMAND_NAME;
    description = "Obten un fumo aleatorio de la Fumo Api";

    run(context: Interaction.InteractionContext) {
        const { URL, _id } = Client.cache.random;

        const embed = new Utils.Embed()
            .setColor(Colors.INVISIBLE)
            .setImage(URL)
            .setFooter(`ID: ${_id}`);

        return context.editOrRespond({ embed });
    }
}