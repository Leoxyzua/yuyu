import { InteractionCommandEvents } from "detritus-client/lib/interaction/events"
import logger from "../../logger"

const CommandRan = ({ command, context }: InteractionCommandEvents.CommandRan) => {
    logger.debug(`User ${context.user.tag} [${context.user.id}] running command ${command.name} in ${context.inDm ? `dm ${context.channel!.name}` : `guild ${context.guild!.name} [${context.guild!.id}]`}`)
}

export default CommandRan

