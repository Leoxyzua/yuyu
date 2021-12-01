import { InteractionContext } from "detritus-client/lib/interaction";
import { Commands } from "../../../../utils/parameters";
import { BaseContextMenuUserCommand, ContextMenuUserArgs } from "../../basecommand";

export const COMMAND_NAME = "User Avatar"

export default class UserAvatarContextMenu extends BaseContextMenuUserCommand {
    name = COMMAND_NAME

    async run(context: InteractionContext, args: ContextMenuUserArgs) {
        return Commands.Avatar.response(context, {
            user: args.member ?? args.user,
            ephemeral: true
        })
    }
}