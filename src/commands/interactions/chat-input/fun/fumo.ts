import { Interaction } from "detritus-client"
import { Error } from "../../../../utils/icons"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = 'fumo'

export default class PingCommand extends BaseCommand<unknown> {
    public name = COMMAND_NAME
    public description = "No disponible"

    public constructor() {
        super({
            metadata: { category: 'misc' }
        })
    }

    public async run(context: Interaction.InteractionContext) {
        const fumoBotInvite = 'https://discord.com/api/oauth2/authorize?client_id=916065710038450186&scope=applications.commands'

        return this.safeReply(
            context,
            `${Error} Los comandos sobre fumos ya no estan disponibles, si los necesitas puedes usar a [Fumo Bot](${fumoBotInvite})`
            , true)
    }
}