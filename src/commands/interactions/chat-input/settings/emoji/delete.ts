import { Constants, Interaction, Structures, Utils } from "detritus-client"
import { BaseSubCommand } from "../../../basecommand"

export const COMMAND_NAME = 'delete'

export interface CommandArgsBefore {
    emojis: Structures.Emoji[] | false
}

export interface CommandArgs {
    emojis: Structures.Emoji[]
}

export class DeleteEmojiCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Borra un emoji del servidor."

    constructor() {
        super({
            options: [{
                name: 'emoji',
                label: 'emojis',
                description: 'Los/el nombre(s) de el/los emoji(s)',
                required: true,
                value: (value: string, context: Interaction.InteractionContext) => {
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

        const result = args.emojis.map((emoji) => emoji.delete({
            reason: `Moderador responsable: ${context.user.tag}`
        }).catch(() => undefined))

        return context.editOrRespond(`Borré correctamente **${result.length}** emoji(s)!`)
    }
}