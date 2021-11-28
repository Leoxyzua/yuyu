import { InteractionCommandClient, ShardClient } from "detritus-client"
import { ClientEvents } from "detritus-client/lib/constants"

import { CommandRan } from "./client"
import { GuildBanAdd, ThreadUpdate } from "./gateway"

process.on('unhandledRejection', console.log)

export default function (client: ShardClient, commandClient: InteractionCommandClient) {
    commandClient.subscribe(ClientEvents.COMMAND_RAN, CommandRan)

    client.subscribe(ClientEvents.GUILD_BAN_ADD, GuildBanAdd)
    client.subscribe(ClientEvents.THREAD_UPDATE, ThreadUpdate)

    console.log('Handlers up')
}

