import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants"
import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands } from "../../../../utils/parameters"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = "http-cat"

export default class HTTPCatCommand extends BaseCommand {
    public name = COMMAND_NAME
    public description = "Obten una imagen de un gato mediante un código HTTP"

    public constructor() {
        super({
            options: [{
                name: 'code',
                description: 'El código HTTP',
                type: ApplicationCommandOptionTypes.INTEGER,
                required: true
            }],
            metadata: { category: 'fun' }
        })
    }

    public async run(context: InteractionContext, args: Commands.HTTPCat.arguments) {
        return Commands.HTTPCat.response(context, args)
    }
}