import { InteractionContext } from "detritus-client/lib/interaction"
import { Commands, Autocomplete, CommandValues } from "../../../../utils/parameters"
import { BaseCommand } from "../../basecommand"
import { Warning } from "../../../../utils/icons"

export const COMMAND_NAME = "help"

export default class HelpCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "Mira mi lista de comandos o información en un comando en especifico"

    constructor() {
        super({
            metadata: { category: 'info' },
            options: [{
                name: 'command',
                description: 'Obtener información de un comando en especifico.',
                onAutoComplete: Autocomplete.findCommands,
                value: CommandValues.findCommand
            }]
        })
    }

    // explicit check if it is set to false, if using "!!" undefined will return false
    onBeforeRun(_context: InteractionContext, args: Commands.Help.argumentsBefore) {
        return !(args.command === false)
    }

    onCancelRun(context: InteractionContext) {
        return this.safeReply(
            context,
            `${Warning} Comando no encontrado.`,
            true
        )
    }

    async run(context: InteractionContext, args: Commands.Help.arguments) {
        return Commands.Help.response(context, args)
    }
}