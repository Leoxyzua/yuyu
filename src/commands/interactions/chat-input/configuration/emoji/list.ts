import { Constants, Interaction, Utils } from "detritus-client"
import { BaseSubCommand } from "../../../basecommand"
import Paginator from "../../../../../utils/paginator"

export interface CommandArgs {
    filter: string // 'all' | 'mine' | 'animated' | 'not_animated'
}

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

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        await context.respond(Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

        const emojis = context.guild!.emojis.length
            ? context.guild!.emojis
            : await context.guild!.fetchEmojis().then((emojis) => {
                context.guild!.emojis = emojis
                return emojis
            })

        const search = emojis.filter((emoji) => {
            switch (args.filter) {
                case 'mine':
                    return emoji.user?.id === context.user.id

                case 'animated':
                    return emoji.animated

                case 'not_animated':
                    return !emoji.animated

                default:
                    return true
            }
        })

        const EMOJIS_PER_PAGE = 10

        const paginator = new Paginator(context, {
            baseArray: search,
            objectsPerPage: EMOJIS_PER_PAGE,
            pageObject: 0,
            lastPage: Math.ceil(search.length / EMOJIS_PER_PAGE),
            onPage: (page, emojis?: typeof search) => {
                const embed = new Utils.Embed()

                if (emojis) embed.setDescription(emojis.map((emoji) => emoji.toString()).join(' '))

                return embed
            }
        })

        return paginator.createMessage()
    }
}