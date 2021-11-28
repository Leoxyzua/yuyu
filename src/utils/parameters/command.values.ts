import { Structures, Interaction, Utils, Endpoints } from "detritus-client"
import getBans from "../getbans"

export async function getBannedUser(value: string, context: Interaction.InteractionContext) {
    const bans = await getBans(context.guild!)
    const valid = bans.find((raw) => raw.user.id === value)
    if (!valid) return null

    return new Structures.User(context.client, valid.user)
}

export interface EmojiBase {
    url: string
    name: string
}

export function parseDuration(value: any) {
    const DAY_IN_MS = 172800000

    if (isNaN(value) || value > DAY_IN_MS) return

    return parseInt(value)
}

export function parseEmojisToDelete(value: string, context: Interaction.InteractionContext) {
    const names: string[] = []
    const { matches } = Utils.regex('EMOJI', value)

    if (matches.length) {
        for (const { name } of matches) {
            if (name) names.push(name)
        }
    } else {
        const emojis = value.split(/ +/)

        for (const name of emojis) {
            names.push(name)
        }
    }

    const emojis = context.guild?.emojis.filter((emoji) => names.includes(emoji.name) || names.includes(emoji.id!))

    return emojis?.length ? emojis : false
}

export function parseEmojisToAdd(value: string) {
    const emojis: EmojiBase[] = []
    const { matches } = Utils.regex('EMOJI', value)

    if (matches.length) {
        for (const { name, id, animated } of matches) {
            if (name && id) {
                const format = (animated) ? 'gif' : 'png'
                const url = Endpoints.CDN.URL + Endpoints.CDN.EMOJI(id, format) + `?size=${animated ? 80 : 160}`

                emojis.push({ name, url })
            }
        }
    }

    return emojis.length ? emojis : false
}