import { InteractionCommandClient, ShardClient } from "detritus-client"
import { ClientEvents } from "detritus-client/lib/constants"

import { CommandRan } from "./client"
import { GuildBanAdd, ThreadUpdate } from "./gateway"

process.on('unhandledRejection', console.log)

export default function (client: ShardClient, commandClient: InteractionCommandClient) {
    commandClient.on(ClientEvents.COMMAND_RAN, CommandRan)

    client.on(ClientEvents.GUILD_BAN_ADD, GuildBanAdd)
    client.on(ClientEvents.THREAD_UPDATE, ThreadUpdate)

    console.log('Handlers up')
}

