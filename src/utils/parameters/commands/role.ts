import { InteractionContext } from "detritus-client/lib/interaction"
import { Markup } from "detritus-client/lib/utils"
import { Member, User, Role } from "detritus-client/lib/structures"
import { safeReply } from "../../tools"
import { Succes } from "../../icons"

export interface argumentsBefore {
    member: Member | User
    role: Role
    time: number | undefined
}

export interface arguments {
    member: Member
    role: Role
    time: number | undefined
}

export async function response(context: InteractionContext, args: arguments) {
    const { id } = args.role
    let method = "add"
    const aor = (method === "add" ? args.member.addRole : args.member.removeRole).bind(args.member)

    if (args.member.roles.has(id)) method = "remove"

    await aor(args.role.id, { reason: `Moderador responsable: ${context.user.tag}` })
    let text = `${Succes} Le ${method === 'add' ? 'añad' : 'remov'}í el rol "${args.role}"" al miembro ${Markup.codestring(args.member.user.tag)}`

    if (args.time) {
        const parsedDuration = Math.floor((Date.now() + args.time) / 1000)
        text += `, esta acción no se revertirá hasta <t:${parsedDuration}:R>`
        setTimeout(() => aor(args.role.id), args.time)
    }

    return safeReply(context, text + '.') // owo
}