import { BaseCommand } from "../../../basecommand"
import { InteractionContext } from "detritus-client/lib/interaction"
import { client } from "."

export interface CommandArgs {
    text: string
}

export const COMMAND_NAME = "thonkify"

export default class GlitchCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "atest"

    constructor() {
        super({
            options: [{
                name: 'text',
                required: true,
                description: 'El texto a mostrar'
            }]
        })
    }

    async run(context: InteractionContext, args: CommandArgs) {
        const buffer = await client.thonkify(args.text)

        return this.safeReply(context, { file: { value: buffer, filename: 'thonkify.png' } })
    }
}