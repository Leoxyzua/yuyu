import { Structures, Interaction, Utils, Constants } from "detritus-client"
import { BaseSubCommand } from "../../../basecommand"
import { Succes, Error } from "../../../../../utils/icons"
import getBans from "../../../../../utils/getbans"

const { codestring } = Utils.Markup

export interface CommandArgsBefore {
    target: Structures.User | undefined
}

export interface CommandArgs {
    target: Structures.User
}

export const COMMAND_NAME = "remove"

export class RemoveBanCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Des-banea a un miembro anteriormente baneado. [Esto no esta terminado]"

    constructor() {
        super({
            options: [{
                name: "member",
                label: 'target',
                description: 'El miembro baneado',
                required: true,
                onAutoComplete: async (context: Interaction.InteractionAutoCompleteContext) => {
                    const bans = await getBans(context.guild!)

                    const bannedUsers = bans
                        .map(({ user }) => user)
                    const value = context.value.toLowerCase()

                    let choices: Array<{ name: string, value: string }> = []

                    if (value) {
                        const users = bans.filter(({ user, reason }) =>
                            user.id === value
                            || user.tag.toLowerCase() === value
                            || user.discriminator === value
                            || user.username.toLowerCase().includes(value)
                            || (!!reason && reason.toLowerCase() === value))
                            .map(({ user }) => user)

                        if (users) choices = users.map(({ tag, id }) => ({ name: tag, value: id }))
                    } else {
                        choices = bannedUsers
                            .map(({ tag, id }) => ({ name: tag, value: id }))
                    }

                    return context.respond({ choices: choices.slice(0, 25) })
                },
                value: async (value: string, context: Interaction.InteractionContext) => {
                    const bans = await getBans(context.guild!)
                    const valid = bans.find((raw) => raw.user.id === value)
                    if (!valid) return

                    return new Structures.User(context.client, valid.user)
                }
            }]
        })
    }

    onBeforeRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.target
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: `${Error} Ese no es un miembro válido.`,
            flags: Constants.MessageFlags.EPHEMERAL
        })
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        await context.guild?.removeBan(args.target.id, {
            reason: `Moderador responsable: ${context.user.tag}`
        })

        return context.editOrRespond(`${Succes} ${args.target.bot ? 'Bot' : 'Miembro'} ${codestring(args.target.tag)} desbaneado.`)
    }
}