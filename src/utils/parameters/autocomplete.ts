import { InteractionAutoCompleteContext } from "detritus-client/lib/interaction"
import ms from "ms"
import getBans from "../getbans"

export async function getGuildBans(context: InteractionAutoCompleteContext) {
    const bans = await getBans(context.guild!)

    const bannedUsers = bans
        .map(({ user }) => user)
    const value = context.value.toLowerCase()

    let choices: Array<{ name: string, value: string }> = []

    if (value) {
        const users = bans.filter(({ user, reason }) =>
            user.id === value
            || user.tag.toLowerCase() === value
            || user.discriminator === value
            || user.username.toLowerCase().includes(value)
            || (!!reason && reason.toLowerCase() === value))
            .map(({ user }) => user)

        if (users) choices = users.map(({ tag, id }) => ({ name: tag, value: id }))
    } else {
        choices = bannedUsers
            .map(({ tag, id }) => ({ name: tag, value: id }))
    }

    return context.respond({ choices: choices.slice(0, 25) })
}

export async function parseDuration(context: InteractionAutoCompleteContext) {
    const template = [
        's:45',
        'h:2',
        'd:1'
    ]

    let values = []
    const strings = template.map((temp) => temp.split(':')[0])

    if (context.value && !isNaN(parseInt(context.value))) {
        values = strings.map((str) => context.value + str)
    } else values = template.map((temp) => {
        const key = temp.split(':')
        return key[1] + key[0]
    })

    const choices = values.map((val) => ({ name: val, value: ms(val).toString() }))

    return context.respond({ choices })
}

export function findCommands(context: InteractionAutoCompleteContext) {
    const { commands } = context.client.interactionCommandClient!
    const value = context.value.toString()

    let choices: Array<{ name: string, value: string }> = []

    if (value) {
        // no idea for name of declarations moment
        const found = commands.filter(({ name }) => name === value || name.includes(value))

        if (found) choices = found.map(({ name }) => ({ name, value: name }))
    } else choices = commands.map(({ name }) => ({ name, value: name }))

    return context.respond({ choices: choices.slice(0, 25) })
}

export function findHTTPCode(context: InteractionAutoCompleteContext) {
    // todo
}