import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseCommand } from "../basecommand"
import { Commands } from "../../../utils/parameters"
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants"

export const COMMAND_NAME = "avatar"

export default class AvatarCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "Muestra el avatar de un usuario."

    constructor() {
        super({
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionTypes.USER,
                    description: 'El usuario a mostrar el avatar. Tip: Puedes poner una ID',
                    required: true
                },
                {
                    name: 'hide',
                    label: 'ephemeral',
                    type: ApplicationCommandOptionTypes.BOOLEAN,
                    description: 'Quieres solo mostrar el avatar para ti?'
                }
            ],
            metadata: { category: 'misc' }
        })
    }

    async run(context: InteractionContext, args: Commands.Avatar.arguments) {
        return Commands.Avatar.response(context, args)
    }
}