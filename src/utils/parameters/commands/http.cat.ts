import { InteractionContext } from "detritus-client/lib/interaction"
import { Embed } from "detritus-client/lib/utils"
import { Colors } from "../../constants"
import { safeReply } from "../../tools"

export interface arguments {
    code: string
}

export async function response(context: InteractionContext, args: arguments) {
    const url = `http.cat`

    const embed = new Embed()
        .setColor(Colors.INVISIBLE)
        .setImage(`https://${url}/${args.code}.jpg`)
        .setFooter(`Host: ${url}`)

    return safeReply(context, {
        embed
    })
}