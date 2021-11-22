import { InteractionCommandEvents } from "detritus-client/lib/interaction/events";

const CommandRan = ({ command, context }: InteractionCommandEvents.CommandRan) => {
    console.log(`User ${context.user.tag} [${context.user.id}] running command ${command.name} in ${context.inDm ? `dm ${context.channel!.name}` : `guild ${context.guild!.name} [${context.guild!.id}]`}`);
};

export default CommandRan;

