import { Interaction, Utils } from "detritus-client"
import { MessageComponentButtonStyles } from "detritus-client/lib/constants"
import { BaseSubCommand } from "../../../basecommand"
import { Client } from "."
import { Colors } from "../../../../../utils/constants"
import { UpdateIcon } from "../../../../../utils/icons"

export const COMMAND_NAME = "random"

export class FumoRandomCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Obten un fumo aleatorio de la Fumo Api"

    run(context: Interaction.InteractionContext | Utils.ComponentContext) {
        const { URL, _id } = Client.cache.random

        const embed = new Utils.Embed()
            .setColor(Colors.INVISIBLE)
            .setImage(URL)
            .setFooter(`ID: ${_id}`)

        const components = new Utils.Components({
            timeout: 1000 * 20,
            onTimeout: async () => await context.editResponse({ embed, components: [] }),
        }).addButton({
            emoji: UpdateIcon,
            style: MessageComponentButtonStyles.SECONDARY,
            run: this.run.bind(this)
        })

        return this.safeReply(context, { embed, components })
    }
}