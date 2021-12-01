import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseSubCommand } from "../../../basecommand"
import { Commands } from "../../../../../utils/parameters"

export const COMMAND_NAME = "list"

export class EmojiListCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Lista de todos los emojis en el servidor"

    constructor() {
        super({
            options: [{
                name: "filter",
                description: "Que tipo/clase de emojis quieres mostrar en especifico?",
                default: 'all',
                choices: [
                    {
                        name: 'Hechos por mi',
                        value: 'mine'
                    },
                    {
                        name: 'Animados',
                        value: 'animated'
                    },
                    {
                        name: 'No animados',
                        value: 'not_animated'
                    }
                ]
            }]
        })
    }

    async run(context: InteractionContext, args: Commands.Emoji.arguments.list) {
        return Commands.Emoji.list(context, args)
    }
}