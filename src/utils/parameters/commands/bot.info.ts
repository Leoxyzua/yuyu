import { InteractionContext } from "detritus-client/lib/interaction"
import { Package } from "detritus-client/lib/constants"
import { Embed, Markup } from "detritus-client/lib/utils"
import { ServerLink } from "../../icons"
import { Colors } from "../../constants"
import { safeReply } from "../../tools"
import PKGJson from "../../../../package.json"

const { codestring, url, timestamp } = Markup

export function botInfo(context: InteractionContext) {
    const { application, user, users, shardCount, interactionCommandClient, presences, guilds } = context.client
    const bol = (input: boolean | undefined) => input ? 'Sí' : 'No'

    const general = new Embed()
        .setColor(Colors.INVISIBLE)
        .setTitle('General')

    const app = new Embed()
        .setColor(Colors.INVISIBLE)
        .setTitle('Aplicación')

    if (user?.avatarUrl) general.setThumbnail(user.avatarUrl)

    general
        .addField('Comandos', `${interactionCommandClient?.commands.size}, escribe ${codestring('/help')} para la lista.`, true)
        .addField('Shards', `${shardCount}, en un total de ${guilds.size} servidores`, true)
        .addField('Librería', `Detritus v${Package.VERSION}`, true)
        .addField('Proceso', `TypeScript v${PKGJson.devDependencies.typescript.slice(1)}\nNodeJS ${process.version}`, true)
        .addField('Usuarios en cache', users.size.toString(), true)
        .addField('Presencias en cache', presences.size.toString(), true)

    if (application) {
        const { description, iconUrl, team, createdAtUnix } = application
        if (description) general.setDescription(description)
        if (iconUrl) app.setThumbnail(iconUrl)

        if (team) app.addField('Team', `Nombre: ${team.name}\nMiembros: ${team.members.map((member) => member.tag).join(', ')}`)
        if (createdAtUnix) app.addField('Fecha de creación', timestamp(createdAtUnix))
    }

    app.addField('Bot pública?', bol(application?.botPublic), true)
    app.addField('Código OAUTH2 requerido?', bol(application?.botRequireCodeGrant), true)

    return safeReply(context, {
        content: `Puedes conseguir los iconos que uso haciendo ${url('click aquí', `<${ServerLink}>`, 'Server de Iconos')}`,
        embeds: [general, app]
    })
}