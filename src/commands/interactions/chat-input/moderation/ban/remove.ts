import { Interaction, Utils } from "detritus-client"
import { MessageFlags } from "detritus-client/lib/constants"
import { User } from "detritus-client/lib/structures"
import { BaseSubCommand } from "../../../basecommand"
import { Autocomplete, CommandValues } from "../../../../../utils/parameters"
import { Succes, Error } from "../../../../../utils/icons"

const { codestring } = Utils.Markup

export interface CommandArgsBefore {
    target: User | undefined
}

export interface CommandArgs {
    target: User
}

export const COMMAND_NAME = "remove"

export class RemoveBanCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Des-banea a un miembro anteriormente baneado."

    constructor() {
        super({
            options: [{
                name: "member",
                label: 'target',
                description: 'El miembro baneado',
                required: true,
                onAutoComplete: Autocomplete.getGuildBans,
                value: CommandValues.getBannedUser
            }]
        })
    }

    onBeforeRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !!args.target
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: `${Error} Ese no es un miembro válido.`,
            flags: MessageFlags.EPHEMERAL
        })
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        await context.guild?.removeBan(args.target.id, {
            reason: `Moderador responsable: ${context.user.tag}`
        })

        return context.editOrRespond(`${Succes} ${args.target.bot ? 'Bot' : 'Miembro'} ${codestring(args.target.tag)} desbaneado.`)
    }
}