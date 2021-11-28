import { Interaction } from "detritus-client"
import { InteractionCallbackTypes } from "detritus-client/lib/constants"
import { BaseSubCommand } from "../../../../basecommand"
import fetch from 'node-fetch'
import { CommandValues } from "../../../../../../utils/parameters"

export const COMMAND_NAME = 'multiple'

export interface CommandArgsBefore {
    emojis: CommandValues.EmojiBase[] | false
}

export interface CommandArgs {
    emojis: CommandValues.EmojiBase[]
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
                value: CommandValues.parseEmojisToAdd
            }]
        })
    }

    onBeforeRun(_context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.emojis
    }

    onCancelRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        if (args.emojis === false) {
            return this.safeReply(context, `No pude encontrar ningun emoji.`, true)
        }
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
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

        return this.safeReply(context, `Cree correctamente **${names.length}** emoji(s)!\n\n${names.join(', ')}`)
    }
}