import { Structures, Constants, Interaction, Utils } from "detritus-client"
import { BaseSubCommand } from "../../../basecommand"
import { Succes } from "../../../../../utils/icons"

const { codestring, bold } = Utils.Markup

export interface CommandArgs {
    target: Structures.Member | Structures.User
    reason: string // not undefined, it has a default value
    delete_days?: string
}

export const COMMAND_NAME = "create"

export class CreateBanCommand extends BaseSubCommand {
    name = COMMAND_NAME
    description = "Banea a un miembro del servidor."

    constructor() {
        super({
            options: [
                {
                    name: 'target',
                    type: Constants.ApplicationCommandOptionTypes.USER,
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

    onBeforeRun(context: Interaction.InteractionContext, { target }: CommandArgs) {
        if (!context.guild || !context.me) return false
        if (!context.guild.members.has(target.id)) return true
        if (target instanceof Structures.Member && target.highestRole?.position! > context.member?.highestRole?.position!) return false

        return context.me.canEdit(target as any) && (context.me.id !== target.id) && (target.id !== context.user.id)
    }

    onCancelRun(context: Interaction.InteractionContext, args: CommandArgs) {
        return context.editOrRespond({
            content: `${args.target.mention} no puede ser baneado.`,
            flags: Constants.MessageFlags.EPHEMERAL
        })
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        const { target, reason, delete_days } = args

        await context.guild?.createBan(target.id, {
            reason: `Moderador responsable: ${context.user.tag} | Razón: ${reason}`,
            deleteMessageDays: delete_days,
        })

        const isBot = target instanceof Structures.User ? target.bot : target.user.bot

        return context.editOrRespond(`${Succes} ${isBot ? 'Bot' : 'Miembro'} ${codestring(target.tag)} baneado con éxito por la razón ${bold(reason)}.`)
    }
}