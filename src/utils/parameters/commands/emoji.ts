import { InteractionContext } from "detritus-client/lib/interaction"
import { InteractionCallbackTypes } from "detritus-client/lib/constants"
import { Embed, regex } from "detritus-client/lib/utils"
import { Colors } from "../../constants"
import { Endpoints } from "detritus-client-rest"
import { EmojiBase } from "../command.values"
import { safeReply, parseEmojiName } from "../../tools"
import Paginator from "../../paginator"
import { Emoji } from "detritus-client/lib/structures"

export namespace argumentsBefore {
    export interface createMultiple {
        emojis: EmojiBase[] | false
    }
    export interface _delete {
        emojis: Emoji[] | false
    }
}

export namespace arguments {
    export interface createOne {
        url: string
        name: string
        type?: 'emoji' | 'url'
    }

    export interface createMultiple {
        emojis: EmojiBase[]
    }

    export interface _delete {
        emojis: Emoji[]
    }

    export interface list {
        filter: string
    }
}

export async function createOne(context: InteractionContext, args: arguments.createOne) {
    await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

    if (args.type === 'emoji') {
        const { matches } = regex('EMOJI', args.url)

        if (matches.length) {
            for (const { name, animated, id } of matches) {
                const format = (animated) ? 'gif' : 'png'
                if (!args.name) args.name = name ?? 'unknown'
                args.url = Endpoints.CDN.URL + Endpoints.CDN.EMOJI(id, format) + `?size=${animated ? 80 : 160}`
            }
        }
    }

    const image = await fetch(args.url)
        .then((res) => res.arrayBuffer())
        .catch(() => []) as Buffer

    if (!image.length) return safeReply(context, `URL inválida.`, true)

    const emoji = await context.guild?.createEmoji({
        name: parseEmojiName(args.name),
        image
    })

    return safeReply(context, `Emoji creado: ${emoji}`)
}

export async function createMultiple(context: InteractionContext, args: arguments.createMultiple) {
    await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

    const names = []

    for (const { url, name } of args.emojis) {
        const image = await fetch(url)
            .then((res) => res.arrayBuffer())
            .catch(() => []) as Buffer

        if (!image.length) continue

        const emoji = await context.guild?.createEmoji({ image, name }).catch(() => undefined)

        if (emoji) names.push(emoji.toString())
    }

    return safeReply(context, `Cree correctamente **${names.length}** emoji(s)!\n\n${names.join(', ')}`)
}
export async function _delete(context: InteractionContext, args: arguments._delete) {
    await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

    const result = args.emojis.map((emoji) => emoji.delete({
        reason: `Moderador responsable: ${context.user.tag}`
    }).catch(() => undefined))

    return safeReply(context, `Borré correctamente **${result.length}** emoji(s)!`)
}
export async function list(context: InteractionContext, args: arguments.list) {
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

    if (!search) return safeReply(
        context,
        `No se encontraron emojis con el filtro **${args.filter}**`,
        true
    )

    const paginator = new Paginator(context, {
        baseArray: search,
        objectsPerPage: 10,
        content: (page) => `Página **${page + "/" + Math.ceil(search.length / 10)}**`,
        onPage: (page, emojis?: typeof search) => {
            const embed = new Embed()
                .setColor(Colors.INVISIBLE)

            if (emojis) embed.setDescription(emojis.map((emoji) => `> ${emoji.name} ${emoji}`).join('\n'))
            else embed.setDescription(`No hay emojis para mostrar`)

            return embed
        }
    })

    return paginator.createMessage()
}
