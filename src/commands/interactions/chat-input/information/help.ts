import { Constants, Interaction, Utils } from "detritus-client"
import { Colors } from "../../../../utils/constants"
import { Warning } from "../../../../utils/icons"
import { parseCategory, parseStrings, parseSubCommands } from "../../../../utils/strings"
import { BaseCommand } from "../../basecommand"

export const COMMAND_NAME = "help"

export interface CommandArgsBefore {
    command: Interaction.InteractionCommand<Interaction.ParsedArgs> | false
}

export interface CommandArgs {
    command: Interaction.InteractionCommand<Interaction.ParsedArgs>
}

export default class HelpCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "Mira mi lista de comandos o información en un comando en especifico"

    constructor() {
        super({
            metadata: { category: 'info' },
            options: [{
                name: 'command',
                description: 'Obtener información de un comando en especifico.',
                onAutoComplete: (context: Interaction.InteractionAutoCompleteContext) => {
                    const { commands } = context.client.interactionCommandClient!
                    const value = context.value.toString()

                    let choices: Array<{ name: string, value: string }> = []

                    if (value) {
                        // no idea for name of declarations moment
                        const found = commands.filter(({ name }) => name === value || name.includes(value))

                        if (found) choices = found.map(({ name }) => ({ name, value: name }))
                    } else choices = commands.map(({ name }) => ({ name, value: name }))

                    return context.respond({ choices: choices.slice(0, 25) })
                },
                value: (input: string, context: Interaction.InteractionContext) => {
                    const { commands } = context.client.interactionCommandClient!

                    return commands.find(({ name }) => name === input) ?? false
                }
            }]
        })
    }

    // explicit check if it is set to false, if using "!!" undefined will return false
    onBeforeRun(_context: Interaction.InteractionContext, args: CommandArgsBefore) {
        return !(args.command === false)
    }

    onCancelRun(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: `${Warning} Comando no encontrado.`,
            flags: Constants.MessageFlags.EPHEMERAL
        })
    }

    async run(context: Interaction.InteractionContext, args: CommandArgs) {
        const embed = new Utils.Embed().setColor(Colors.INVISIBLE)

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

                embed.addField(parseCategory(category), Utils.Markup.codeblock(names.join('\n')))
            }
        }

        return context.editOrRespond({ embed, flags: Constants.MessageFlags.EPHEMERAL })
    }
}