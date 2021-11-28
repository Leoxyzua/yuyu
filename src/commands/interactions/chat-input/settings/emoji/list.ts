import { Interaction, Utils } from "detritus-client"
import { InteractionCallbackTypes, MessageFlags } from "detritus-client/lib/constants"
import { BaseSubCommand } from "../../../basecommand"
import Paginator from "../../../../../utils/paginator"
import { Colors } from "../../../../../utils/constants"

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
        await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

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

        if (!search) return this.safeReply(
            context,
            `No se encontraron emojis con el filtro **${args.filter}**`,
            true
        )

        const paginator = new Paginator(context, {
            baseArray: search,
            objectsPerPage: 10,
            content: (page) => `Pagina **${page + "/" + Math.ceil(search.length / 10)}**`,
            onPage: (page, emojis?: typeof search) => {
                const embed = new Utils.Embed()
                    .setColor(Colors.INVISIBLE)

                if (emojis) embed.setDescription(emojis.map((emoji) => `> ${emoji.name} ${emoji}`).join('\n'))
                else embed.setDescription(`No hay emojis para mostrar`)

                return embed
            }
        })

        return paginator.createMessage()
    }
}