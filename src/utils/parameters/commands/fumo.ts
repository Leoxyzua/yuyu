import { InteractionContext } from "detritus-client/lib/interaction"
import {
    ComponentContext,
    Components,
    Embed,
    Markup
} from "detritus-client/lib/utils"
import { MessageComponentButtonStyles } from "detritus-client/lib/constants"
import { FumoClient, FumoData } from "fumo-api"
import {
    Colors,
    YOUTUBE_VIDEO_URL_REGEX,
    REDDIT_BASE_URL,
    CDN_URL_REGEX
} from "../../constants"
import Paginator from "../../paginator"
import redditFetch from "../../reddit.fetch"
import { safeReply } from "../../tools"
import { UpdateIcon } from "../../icons"

export const client = new FumoClient()

export interface Field {
    text: string
    thumbnail: string
}

export namespace argumentsBefore {
    export interface get {
        fumo: FumoData | false
    }
}
export namespace arguments {
    export interface get {
        fumo: FumoData
    }

    export interface reddit {
        subreddit: string
    }
}

export function get(context: InteractionContext, args: arguments.get) {
    return safeReply(context, args.fumo.URL)
}

export function list(context: InteractionContext) {
    const { list } = client.cache

    const paginator = new Paginator(context, {
        baseArray: list,
        objectsPerPage: 4,
        content: (page) => {
            const pages = Math.ceil(list.length / 4)
            return `Página ${Markup.bold(page + "/" + pages)}`
        },
        onPage: (_page, fumos?: FumoData[]) => {
            const fields: Field[] = []

            if (fumos) {
                for (const fumo of fumos) {
                    const index = list.indexOf(fumo) + 1

                    fields.push({
                        text: `> ${Markup.bold("#" + index)} ${fumo._id} - ${Markup.bold(Markup.url('URL', fumo.URL, 'Un fumo'))}`,
                        thumbnail: fumo.URL
                    })
                }
            }

            const embeds = fields
                .map((field) => new Embed({
                    url: client.url,
                    description: fields.map((field) => field.text).join("\n"),
                })
                    .setColor(Colors.INVISIBLE)
                    .setImage(field.thumbnail)) // actually creating multiple embeds with different image urls shows the same image so idk

            return embeds
        }
    })

    return paginator.createMessage()
}
export function random(context: InteractionContext | ComponentContext) {
    const { URL, _id } = client.cache.random

    const embed = new Embed()
        .setColor(Colors.INVISIBLE)
        .setImage(URL)
        .setFooter(`ID: ${_id}`)

    const components = new Components({
        timeout: 1000 * 20,
        onTimeout: async () => await context.editResponse({ embed, components: [] }),
    }).addButton({
        emoji: UpdateIcon,
        style: MessageComponentButtonStyles.SECONDARY,
        run: random
    })

    return safeReply(context, { embed, components })
}
export async function reddit(context: InteractionContext, args: arguments.reddit) {
    const data = await redditFetch({
        subreddit: args.subreddit,
        videos: true,
        nsfw: context.channel?.nsfw,
        limit: 100
    })

    if (!data) return safeReply(context, `${Error} No se encontraron posts.`, true)

    const paginator = new Paginator(context, {
        content: (page) => `Post ${(Markup.bold(page + "/" + data.length))}`,
        baseArray: data,
        onPage: (page) => {
            const post = data[page - 1]
            const description = [post.title + '\n']

            const embed = new Embed()
                .setAuthor(post.author, null, `${REDDIT_BASE_URL}/user/${post.author}`)
                .setColor(Colors.INVISIBLE)
                .setFooter(`r/${args.subreddit} • ID ${post.id}`)
                .setTimestamp(post.created * 1000)

            const { bold, url } = Markup

            if (post.permalink) description.push(`${bold('URL:')} ${url('Click aquí', REDDIT_BASE_URL + post.permalink)}`)
            if (YOUTUBE_VIDEO_URL_REGEX.test(post.url))
                description.push(`${bold('Video:')} ${url('Mirar en youtube', post.url)}`)
            else if (CDN_URL_REGEX.test(post.url)) embed.setImage(post.url)
            if (post.num_comments) description.push(`${bold('Comentarios:')} ${post.num_comments}`)
            if (post.is_video) {
                embed.setImage(post.thumbnail) // sometimes its a yt video or etc
                description.push(`${bold('Video:')} ${url('Click aquí', post.url)}`)
            }

            if (post.score) description.push(`${bold('Likes:')} ${post.score}`)

            if (post.crosspost_parent_list?.length) {
                description.push('\n' + bold(`CROSSPOSTS (${post.crosspost_parent_list.length})`))
                for (const crosspost of post.crosspost_parent_list) {
                    if (crosspost.num_comments && !description.some((desc) => desc.includes('Comentarios:')))
                        description.push(`${bold('Comentarios:')} ${crosspost.num_comments}`)
                }
            }

            return embed.setDescription(description.join('\n'))
        }
    })

    return paginator.createMessage()
}