import { Interaction } from "detritus-client"
import { categories } from "./constants"

export function chunkString(str: string, length = 2000) {
    return str.trim().match(new RegExp(`.{1,${length}}`, 'g'))
}

export function parseStrings(strings: any[]): string[] {
    const all: string[] = []

    for (const string of strings) {
        if (Array.isArray(string)) {
            const parsed = parseStrings(string)
            parsed.map((p) => all.push(p))
        } else all.push(string)
    }

    return all
}

export function parseSubCommands(
    options: Interaction.InteractionCommandOption<Interaction.ParsedArgs>[] | undefined,
    command?: string
): string[] | string {
    const names = []

    if (!options && command) return "/" + command

    for (const option of options!) {

        if (option.type === 2) { // make a loop for the sub command groups
            for (const sub of parseSubCommands(option.options)!) {
                names.push(`${option.name} ${sub}`)
            }
        }
        else if (option.type === 1) {
            names.push(option.name)
        }
    }

    return names.map((name) => command ? `/${command} ${name}` : name)
}

export function parseCategory(category: string): string {
    // @ts-ignore
    return categories[category] ?? formatString(category)
}

export const formatString = (string: string): string => string ? string[0].toUpperCase() + string.slice(1) : 'Oops'