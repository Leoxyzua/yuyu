import { InteractionCommandClient, ShardClient } from "detritus-client"
import { ClientEvents } from "detritus-client/lib/constants"
import { emitWarning } from "process"
import logger from "../logger"

import { CommandRan } from "./client"
import { GuildBanAdd, ThreadUpdate } from "./gateway"

process.on('unhandledRejection', logger.error)
process.emitWarning = (warning, arg: any, ...rest: any[]) => {
    if (arg === 'ExperimentalWarning') {
        return;
    }

    return emitWarning(warning, arg, ...rest);
};

export default function (client: ShardClient, commandClient: InteractionCommandClient) {
    commandClient.subscribe(ClientEvents.COMMAND_RAN, CommandRan)

    client.subscribe(ClientEvents.GUILD_BAN_ADD, GuildBanAdd)
    client.subscribe(ClientEvents.THREAD_UPDATE, ThreadUpdate)

    logger.info('Handlers listening')
}

