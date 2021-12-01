import { InteractionContext } from "detritus-client/lib/interaction"
import { regex } from "detritus-client/lib/utils"
import { BaseSubCommand } from "../../../../basecommand"
import { Commands } from "../../../../../../utils/parameters"
import { CDN_URL_REGEX } from "../../../../../../utils/constants"

export const COMMAND_NAME = "one"

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

    async onBeforeRun(context: InteractionContext, args: Commands.Emoji.arguments.createOne) {
        if (CDN_URL_REGEX.test(args.url)) args.type = 'url'
        if (regex('EMOJI', args.url).matches.length) args.type = 'emoji'

        return !!args.type && (args.type === 'url' ? !!args.name : true)
    }

    async onCancelRun(context: InteractionContext, args: Commands.Emoji.arguments.createOne) {
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

    onError(context: InteractionContext) {
        return this.safeReply(context, `Error al crear el emoji, asegurate que haya espacio para más y que no sea demasiado largo el archivo.`)
    }

    async run(context: InteractionContext, args: Commands.Emoji.arguments.createOne) {
        return Commands.Emoji.createOne(context, args)
    }
}