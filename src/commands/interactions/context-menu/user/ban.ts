import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands } from "../../../../utils/parameters"
import { BaseContextMenuUserCommand, ContextMenuUserArgs } from "../../basecommand"

export const COMMAND_NAME = "Ban Member"

export default class BanMemberContextMenu extends BaseContextMenuUserCommand {
    public name = COMMAND_NAME

    public onBeforeRun(context: InteractionContext, { member }: ContextMenuUserArgs) {
        if (!context.guild || !context.me || !member) return false
        if (!context.guild.members.has(member.id)) return true
        if (member.highestRole?.position! > context.member?.highestRole?.position!) return false

        return context.me.canEdit(member as any) && (context.me.id !== member.id) && (member.id !== context.user.id)
    }

    public onCancelRun(context: InteractionContext, args: ContextMenuUserArgs) {
        return this.safeReply(context, `${args.user.mention} no puede ser baneado.`, true)
    }

    public async run(context: InteractionContext, args: ContextMenuUserArgs) {
        return Commands.Ban.create(context, {
            target: args.member!,
            reason: `Comando context menu ejecutado por ${context.user.tag}`
        })
    }
}