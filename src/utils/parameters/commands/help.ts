import {
    InteractionCommand,
    InteractionContext,
    ParsedArgs
} from "detritus-client/lib/interaction"
import { Embed, Markup } from "detritus-client/lib/utils"
import { Colors } from "../../constants"
import {
    parseCategory,
    parseStrings,
    parseSubCommands
} from "../../strings"
import { safeReply } from "../../tools"
export interface argumentsBefore {
    command: InteractionCommand<ParsedArgs> | false
}
export interface arguments {
    command: InteractionCommand<ParsedArgs>
}

export function response(context: InteractionContext, args: arguments) {
    const embed = new Embed().setColor(Colors.INVISIBLE)

    if (args.command) {
        embed
            .setTitle(`Comando "${args.command.name}"`)
            .setDescription(args.command.description)
    } else {
        const { commands } = context.client.interactionCommandClient!
        const categories = [...new Set(commands.map((n) => n.metadata.category))]

        embed.setTitle('Lista de comandos')

        for (const category of categories) {
            if (!category) continue

            const cmds = commands
                .filter(({ metadata }) => metadata.category === category)
                .map(({ name, options }) => ({ name, options }))

            const names = parseStrings(cmds.map(({ options, name }) => parseSubCommands(options, name)))

            embed.addField(parseCategory(category), Markup.codeblock(names.join('\n')))
        }
    }

    return safeReply(context, { embed }, true)
}