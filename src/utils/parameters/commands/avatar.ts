import { InteractionContext } from "detritus-client/lib/interaction"
import { Member, User } from "detritus-client/lib/structures"
import { Embed } from "detritus-client/lib/utils"
import { Colors } from "../../constants"
import { safeReply } from "../../tools"

export interface arguments {
    user: Member | User
    ephemeral: boolean
}

export function response(context: InteractionContext, args: arguments) {
    const member = args.user as Member
    const user = args.user instanceof Member ? member.user : args.user

    const avatars = [user.avatarUrlFormat(null, { size: 4096 })]
    if (member?.avatar) avatars.push(member.avatarUrlFormat(null, { size: 4096 }))

    const embeds = avatars
        .map((url, index) =>
            new Embed()
                .setImage(url)
                .setColor(Colors.INVISIBLE)
                .setTitle(index ? 'Member Avatar' : `User Avatar de ${user.tag}`)
        )

    return safeReply(context, { embeds }, args.ephemeral)
}