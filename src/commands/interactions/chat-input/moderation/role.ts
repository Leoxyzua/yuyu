import { Constants, Interaction, Structures, Utils } from "detritus-client"
import { Autocomplete, CommandValues } from "../../../../utils/parameters"
import { Succes, Warning } from "../../../../utils/icons"
import { BaseCommand } from "../../basecommand"

const { codestring } = Utils.Markup

export const COMMAND_NAME = "role"

export interface CommandArgsBefore {
    member: Structures.Member | Structures.User
    role: Structures.Role
    time: number | undefined
}

export interface CommandArgs {
    member: Structures.Member
    role: Structures.Role
    time: number | undefined
}

export default class BanCommands extends BaseCommand {
    name = COMMAND_NAME
    description = "Añade o quitale un rol a un miembro."
    triggerLoadingAfter = 1000

    constructor() {
        super({
            options: [
                {
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'El miembro',
                    required: true
                },
                {
                    type: Constants.ApplicationCommandOptionTypes.ROLE,
                    name: 'role',
                    description: 'El rol',
                    required: true
                },
                {
                    name: 'time',
                    description: 'Cuanto tiempo durará la acción',
                    onAutoComplete: Autocomplete.parseDuration,
                    value: CommandValues.parseDuration
                }
            ],
            metadata: { category: 'mod' }
        })
    }

    permissions = [Constants.Permissions.MANAGE_ROLES]

    onBeforeRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return (args.member instanceof Structures.Member)
            && (args.role.id !== context.guildId)
            && (context.me?.canEditRole(args.role)!)
            && (context.member?.highestRole!.position! > args.role.position)
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: `${Warning} El usuario mencionado no es un miembro válido o yo/tu no pued(e/o) manejar el rol.`,
            flags: Constants.MessageFlags.EPHEMERAL
        })
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        const { id } = args.role
        let method = "add"
        const aor = (method === "add" ? args.member.addRole : args.member.removeRole).bind(args.member)

        if (args.member.roles.has(id)) method = "remove"

        await aor(args.role.id, { reason: `Moderador responsable: ${context.user.tag}` })
        let text = `${Succes} Le ${method === 'add' ? 'añad' : 'remov'}í el rol "${args.role}"" al miembro ${codestring(args.member.user.tag)}`

        if (args.time) {
            const parsedDuration = Math.floor((Date.now() + args.time) / 1000)
            text += `, esta acción no se revertirá hasta <t:${parsedDuration}:R>`
            setTimeout(() => aor(args.role.id), args.time)
        }

        return context.editOrRespond(text + '.') // owo
    }
}