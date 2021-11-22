import { GatewayClientEvents } from "detritus-client";

const ThreadUpdate = ({ thread, old }: GatewayClientEvents.ThreadUpdate) => {
    if (!old?.threadMetadata?.archived && thread.threadMetadata?.archived) {
        thread.edit({
            archived: false,
            locked: false
        });
    }
}

export default ThreadUpdate;