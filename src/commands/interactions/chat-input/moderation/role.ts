import { Constants, Interaction, Structures, Utils } from "detritus-client";
import { Succes, Warning } from "../../../../utils/icons";
import { BaseCommand } from "../../basecommand";

export const COMMAND_NAME = "";

export interface CommandArgsBefore {
    member: Structures.Member | Structures.User;
    role: Structures.Role;
}

export interface CommandArgs {
    member: Structures.Member;
    role: Structures.Role;
}

export default class BanCommands extends BaseCommand {
    name = COMMAND_NAME;
    description = "Añade o quitale un rol a un miembro.";

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
                }
            ],
            metadata: { category: 'mod' }
        });
    }

    permissions = [Constants.Permissions.MANAGE_ROLES];

    onBeforeRun(context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return (args.member instanceof Structures.Member)
            && (context.me?.highestRole!.position! > args.role.position)
            && (context.member?.highestRole!.position! > args.role.position);
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: `${Warning} El usuario mencionado no es un miembro válido o yo/tu no pued(e/o) manejar el rol.`,
            flags: Constants.MessageFlags.EPHEMERAL
        });
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        const reason = `Moderador responsable: ${context.user.tag}`;
        const { id } = args.role;
        let method = "add";

        if (args.member.roles.has(id)) await args.member.removeRole(id, { reason }), method = "remove";
        else await args.member.addRole(id, { reason });


        return context.editOrRespond(`${Succes} Le ${method === 'add' ? 'añad' : 'remov'}í el rol ${args.role} al miembro ${Utils.Markup.codestring(args.member.user.tag)}`);
    }
}