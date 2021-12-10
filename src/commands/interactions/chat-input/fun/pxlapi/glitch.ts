import { BaseCommand } from "../../../basecommand"
import { InteractionContext } from "detritus-client/lib/interaction"
import { client } from "."

export const COMMAND_NAME = "glitch"

export default class GlitchCommand extends BaseCommand {
    public name = COMMAND_NAME
    public description = "Añadele un efecto glitch a tu avatar"

    public async run(context: InteractionContext) {
        const buffer = await client.glitch([context.user.avatarUrl])

        return this.safeReply(context, {
            file: {
                value: buffer,
                filename: 'glitch.gif'
            }
        })
    }
}