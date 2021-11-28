import { Interaction, Utils } from "detritus-client"
import { BaseSubCommand } from "../../../basecommand"
import redditFetch from "../../../../../utils/reddit.fetch"
import Paginator from "../../../../../utils/paginator"
import { Colors } from "../../../../../utils/constants"
import { CDN_URL_REGEX } from "../../settings/emoji/create/one"
import { Error } from "../../../../../utils/icons"

const { bold, url } = Utils.Markup

export const YOUTUBE_VIDEO_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?<id>[a-zA-Z0-9_-]{11})/
export const COMMAND_NAME = "reddit"
export const BASE_URL = "https://reddit.com"
export const SUBREDDITS = [
    'FumoFumo',
    'Touhou',
    '2hujerk' // there are some posts so ok
]

export interface CommandArgs {
    subreddit: string
}

export class FumoRedditCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Muestra posts de reddit relcionados a los fumos"
    triggerLoadingAfter = 2000

    constructor() {
        super({
            options: [{
                name: 'subreddit',
                description: 'En qué reddit quieres buscar?',
                required: true,
                choices: SUBREDDITS.map((subreddit) => ({ name: subreddit, value: subreddit }))
            }]
        })
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        const data = await redditFetch({
            subreddit: args.subreddit,
            videos: true,
            nsfw: context.channel?.nsfw,
            limit: 100
        })

        if (!data) return this.safeReply(context, `${Error} No se encontraron posts.`, true)

        const paginator = new Paginator(context, {
            content: (page) => `Post ${(bold(page + "/" + data.length))}`,
            onPage: (page) => {
                const post = data[page - 1]
                const description = [post.title + '\n']

                const embed = new Utils.Embed()
                    .setAuthor(post.author, null, `${BASE_URL}/user/${post.author}`)
                    .setColor(Colors.INVISIBLE)
                    .setFooter(`r/${args.subreddit} • ID ${post.id}`)
                    .setTimestamp(post.created * 1000)

                if (post.permalink) description.push(`${bold('URL:')} ${url('Click aquí', BASE_URL + post.permalink)}`)
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
}