import { InteractionContext } from "detritus-client/lib/interaction"
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants"
import { Member } from "detritus-client/lib/structures"
import { BaseSubCommand } from "../../../basecommand"
import { Commands } from "../../../../../utils/parameters"

export const COMMAND_NAME = "create"

export class CreateBanCommand extends BaseSubCommand {
    public name = COMMAND_NAME
    public description = "Banea a un miembro del servidor."

    public constructor() {
        super({
            options: [
                {
                    name: 'target',
                    type: ApplicationCommandOptionTypes.USER,
                    description: 'El miembro a banear',
                    required: true
                },
                {
                    name: 'reason',
                    description: 'La razón a desplegar en los logs',
                    default: 'no especificada'
                },
                {
                    name: 'delete_days',
                    description: 'El número de días a borrar el historial de mensajes',
                    choices: [...Array(8).keys()].map((day) => ({ name: day.toString(), value: day.toString() })),
                }
            ]
        })
    }

    public onBeforeRun(context: InteractionContext, { target }: Commands.Ban.arguments.create) {
        if (!context.guild || !context.me) return false
        if (!context.guild.members.has(target.id)) return true
        if (target instanceof Member && target.highestRole?.position! > context.member?.highestRole?.position!) return false

        return context.me.canEdit(target as any) && (context.me.id !== target.id) && (target.id !== context.user.id)
    }

    public onCancelRun(context: InteractionContext, args: Commands.Ban.arguments.create) {
        return this.safeReply(context, `${args.target.mention} no puede ser baneado.`, true)
    }

    public async run(context: InteractionContext, args: Commands.Ban.arguments.create) {
        return Commands.Ban.create(context, args)
    }
}