import { InteractionContext } from "detritus-client/lib/interaction"
import { Member, User } from "detritus-client/lib/structures"
import { Markup } from "detritus-client/lib/utils"
import { safeReply } from "../../tools"
import { Succes } from "../../icons"

export namespace argumentsBefore {
    export interface remove {
        target: User | undefined
    }
}

export namespace arguments {
    export interface create {
        target: Member | User
        reason: string // not undefined, it has a default value
        delete_days?: string
    }

    export interface remove {
        target: User
    }
}

export async function create(context: InteractionContext, args: arguments.create) {
    const { target, reason, delete_days } = args

    await context.guild?.createBan(target.id, {
        reason: `Moderador responsable: ${context.user.tag} | Razón: ${reason}`,
        deleteMessageDays: delete_days,
    })

    const isBot = target instanceof User ? target.bot : target.user.bot

    return safeReply(context, `${Succes} ${isBot ? 'Bot' : 'Miembro'} ${Markup.codestring(target.tag)} baneado con éxito por la razón ${Markup.bold(reason)}.`)
}

export async function remove(context: InteractionContext, args: arguments.remove) {
    await context.guild?.removeBan(args.target.id, {
        reason: `Moderador responsable: ${context.user.tag}`
    })

    return safeReply(context, `${Succes} ${args.target.bot ? 'Bot' : 'Miembro'} ${Markup.codestring(args.target.tag)} desbaneado.`)
}