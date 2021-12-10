import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseSubCommand } from "../../../basecommand"
import { Autocomplete, Commands, CommandValues } from "../../../../../utils/parameters"
import { Error } from "../../../../../utils/icons"

export const COMMAND_NAME = "remove"

export class RemoveBanCommand extends BaseSubCommand {
    public name = COMMAND_NAME
    public description = "Des-banea a un miembro anteriormente baneado."

    public constructor() {
        super({
            options: [{
                name: "member",
                label: 'target',
                description: 'El miembro baneado',
                required: true,
                onAutoComplete: Autocomplete.getGuildBans,
                value: CommandValues.getBannedUser
            }]
        })
    }

    public onBeforeRun(context: InteractionContext, args: Commands.Ban.argumentsBefore.remove) {
        return !!args.target
    }

    public onCancelRun(context: InteractionContext) {
        return this.safeReply(context, `${Error} Ese no es un miembro válido.`, true)
    }

    public async run(context: InteractionContext, args: Commands.Ban.arguments.remove) {
        return Commands.Ban.remove(context, args)
    }
}