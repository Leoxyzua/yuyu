import { Interaction, Utils } from "detritus-client"
import { BaseSubCommand } from "../../../basecommand"
import { ReplyUp, ReplyDown, ReplyMiddle } from "../../../../../utils/icons"
import { FumoData } from "fumo-api"
import { Client } from "."
import { Colors } from "../../../../../utils/constants"
import Paginator from "../../../../../utils/paginator"

export interface Field {
    text: string;
    thumbnail: string;
}

const { bold, url } = Utils.Markup
export const COMMAND_NAME = "list"

export class FumoListCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "List of all fumos in the Fumo Api"
    async run(context: Interaction.InteractionContext) {
        const { list } = Client.cache

        const paginator = new Paginator(context, {
            baseArray: list,
            objectsPerPage: 4,
            content: (page) => {
                const pages = Math.ceil(list.length / 4)
                return `Pagina ${bold(page + "/" + pages)}`
            },
            onPage: (_page, fumos?: FumoData[]) => {
                const fields: Field[] = []
                let i = 0

                if (fumos) {
                    for (const fumo of fumos) {
                        i++

                        const index = list.indexOf(fumo) - 4
                        const emoji = i === 1 ? ReplyUp : i === 4 ? ReplyDown : ReplyMiddle

                        fields.push({
                            text: `${emoji} ${bold("#" + index)} ${fumo._id} - ${bold(url('URL', fumo.URL, 'Un fumo'))}`,
                            thumbnail: fumo.URL
                        })
                    }
                }

                const embeds = fields.map((field) => new Utils.Embed({
                    url: Client.url,
                    description: fields.map((field) => field.text).join("\n"),
                })
                    .setColor(Colors.INVISIBLE)
                    .setImage(field.thumbnail)) // actually creating multiple embeds with different image urls shows the same image so idk

                return embeds
            }
        })

        return paginator.createMessage()
    }
}