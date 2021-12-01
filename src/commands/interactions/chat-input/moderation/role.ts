import { InteractionContext } from "detritus-client/lib/interaction"
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants"
import { Member } from "detritus-client/lib/structures"
import { Commands, Autocomplete, CommandValues } from "../../../../utils/parameters"
import { Warning } from "../../../../utils/icons"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = "role"

export default class BanCommands extends BaseCommand {
    name = COMMAND_NAME
    description = "Añade o quitale un rol a un miembro."
    triggerLoadingAfter = 1000

    constructor() {
        super({
            options: [
                {
                    type: ApplicationCommandOptionTypes.USER,
                    name: 'member',
                    description: 'El miembro',
                    required: true
                },
                {
                    type: ApplicationCommandOptionTypes.ROLE,
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

    permissions = [Permissions.MANAGE_ROLES]

    onBeforeRun(context: InteractionContext, args: Commands.Role.argumentsBefore) {
        return (args.member instanceof Member)
            && (args.role.id !== context.guildId)
            && (context.me?.canEditRole(args.role)!)
            && (context.member?.highestRole!.position! > args.role.position)
    }

    onCancelRun(context: InteractionContext) {
        return this.safeReply(
            context,
            `${Warning} El usuario mencionado no es un miembro válido o yo/tu no pued(e/o) manejar el rol.`,
            true
        )
    }

    async run(context: InteractionContext, args: Commands.Role.arguments) {
        return Commands.Role.response(context, args)

    }
}