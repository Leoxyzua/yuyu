import { BaseCommand } from "../../../basecommand"
import { InteractionContext } from "detritus-client/lib/interaction"
import { client } from "."

export const COMMAND_NAME = "lego"

export default class GlitchCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "atest"
    triggerLoadingAfter = 2000

    async run(context: InteractionContext) {

        const buffer = await client.lego([context.user.avatarUrl])

        return this.safeReply(context, {
            file: {
                value: buffer,
                filename: 'lego.png'
            }
        })
    }
}