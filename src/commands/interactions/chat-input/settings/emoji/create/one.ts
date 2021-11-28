import { Interaction, Utils } from "detritus-client"
import { InteractionCallbackTypes, MessageFlags } from "detritus-client/lib/constants"
import { Endpoints } from "detritus-client-rest"
import { BaseSubCommand } from "../../../../basecommand"
import { parseEmojiName } from ".."
import fetch from 'node-fetch'

export const CDN_URL_REGEX = /(https?:\/\/.*\.(?:png|jpg|gif))/

export const COMMAND_NAME = "one"

export interface CommandArgs {
    url: string
    name: string
    type?: 'emoji' | 'url'
}

export class CreateOneEmojiCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Añade un emoji al servidor."

    constructor() {
        super({
            options: [
                {
                    name: 'emoji',
                    label: 'url',
                    description: 'La URL del archivo o el emoji a robar (xd)',
                    required: true
                },
                {
                    name: 'name',
                    description: 'El nombre del emoji a crear, requerido si es una URL'
                }
            ]
        })
    }

    // TODO: add a value for the option

    async onBeforeRun(_context: Interaction.InteractionContext, args: CommandArgs) {
        if (CDN_URL_REGEX.test(args.url)) args.type = 'url'
        if (Utils.regex('EMOJI', args.url).matches.length) args.type = 'emoji'

        return !!args.type && (args.type === 'url' ? !!args.name : true)
    }

    async onCancelRun(context: Interaction.InteractionContext, args: CommandArgs) {
        const error = args.type
            ? (args.type === 'url' && !args.name)
                ? 'URL, pero sin nombre'
                : 'Desconocido'
            : 'Emoji mal formateado'

        return this.safeReply(
            context,
            `Uso mal del comando, asegurate haber ingresado un emoji o URL valido (Error: ${error})`,
            true
        )
    }

    onError(context: Interaction.InteractionContext) {
        return this.safeReply(context, `Error al crear el emoji, asegurate que haya espacio para más y que no sea demasiado largo el archivo.`)
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        await context.respond(InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)

        if (args.type === 'emoji') {
            const { matches } = Utils.regex('EMOJI', args.url)

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

        if (!image.length) return this.safeReply(context, `URL inválida.`, true)

        const emoji = await context.guild?.createEmoji({
            name: parseEmojiName(args.name),
            image
        })

        return this.safeReply(context, `Emoji creado: ${emoji}`)
    }
}