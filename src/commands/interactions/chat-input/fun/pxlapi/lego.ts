import { BaseCommand } from "../../../basecommand"
import { InteractionContext } from "detritus-client/lib/interaction"
import { client } from "."

export const COMMAND_NAME = "lego"

export default class GlitchCommand extends BaseCommand {
    public name = COMMAND_NAME
    public description = "Convierte tu avatar en legos"
    public triggerLoadingAfter = 2000

    public async run(context: InteractionContext) {

        const buffer = await client.lego([context.user.avatarUrl])

        return this.safeReply(context, {
            file: {
                value: buffer,
                filename: 'lego.png'
            }
        })
    }
}