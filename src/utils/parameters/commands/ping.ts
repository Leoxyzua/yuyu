import { InteractionContext } from "detritus-client/lib/interaction"
import { safeReply } from "../../tools"

export async function ping(context: InteractionContext) {
    const pings: { [key: string]: number } = await context.client.ping()

    const text = Object.keys(pings)
        .map((ping) => `${ping}: ${pings[ping]} ms`)
        .join(', ')

    return safeReply(context, `pong! 🏓\n\n${text}`)
}