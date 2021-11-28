import { Constants, Interaction, Utils, Endpoints } from "detritus-client"
import { BaseSubCommand } from "../../../../basecommand"
import fetch from 'node-fetch'

export const COMMAND_NAME = 'multiple'

// discord emoji id regex


interface EmojiBase {
    url: string
    name: string
}

export interface CommandArgsBefore {
    emojis: EmojiBase[] | false
}

export interface CommandArgs {
    emojis: EmojiBase[]
}

export class CreateMultipleEmojisCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Crea multiples emojis."

    constructor() {
        super({
            options: [{
                name: 'emojis',
                description: 'Los emojis a añadir',
                required: true,
                value: (value: string) => {
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
            }]
        })
    }

    onBeforeRun(_context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.emojis
    }

    onCancelRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        if (args.emojis === false) {
            return context.editOrRespond({
                content: `No pude encontrar ningun emoji.`,
                flags: Constants.MessageFlags.EPHEMERAL
            })
        }
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        await context.respond(Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

        const names = []

        for (const { url, name } of args.emojis) {
            const image = await fetch(url)
                .then((res) => res.arrayBuffer())
                .catch(() => []) as Buffer

            if (!image.length) continue

            const emoji = await context.guild?.createEmoji({ image, name }).catch(() => undefined)

            if (emoji) names.push(emoji.toString())
        }

        return context.editOrRespond(`Cree correctamente **${names.length}** emoji(s)!\n\n${names.join(', ')}`)
    }
}