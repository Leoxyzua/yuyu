import { Constants, Interaction, Utils } from "detritus-client";
import { BaseCommand } from "../../basecommand";
import { ServerLink } from "../../../../utils/icons";
import { Colors } from "../../../../utils/constants";
import pkgjson from '../../../../../package.json';

const { codestring, url, timestamp } = Utils.Markup;

export const COMMAND_NAME = "botinfo";

export default class BotInfoCommand extends BaseCommand {
    name = COMMAND_NAME;
    description = "Sobre mí";

    constructor() {
        super({
            metadata: { category: 'info' }
        });
    }

    async run(context: Interaction.InteractionContext) {
        const { application, user, users, shardCount, interactionCommandClient, presences, guilds } = context.client;
        const bol = (input: boolean | undefined) => input ? 'Sí' : 'No';

        const general = new Utils.Embed()
            .setColor(Colors.INVISIBLE)
            .setTitle('General');

        const app = new Utils.Embed()
            .setColor(Colors.INVISIBLE)
            .setTitle('Aplicación');

        if (user?.avatarUrl) general.setThumbnail(user.avatarUrl);

        general
            .addField('Comandos', `${interactionCommandClient?.commands.size}, escribe ${codestring('/help')} para la lista.`, true)
            .addField('Shards', `${shardCount}, en un total de ${guilds.size} servidores`, true)
            .addField('Librería', `Detritus v${Constants.Package.VERSION}`, true)
            .addField('Proceso', `TypeScript v${pkgjson.devDependencies.typescript.slice(1)}\nNodeJS ${process.version}`, true)
            .addField('Usuarios en cache', users.size.toString(), true)
            .addField('Presencias en cache', presences.size.toString(), true);

        if (application) {
            const { description, iconUrl, team, createdAtUnix } = application
            if (description) general.setDescription(description);
            if (iconUrl) app.setThumbnail(iconUrl);

            if (team) app.addField('Team', `Nombre: ${team.name}\nMiembros: ${team.members.map((member) => member.tag).join(', ')}`);
            if (createdAtUnix) app.addField('Fecha de creación', timestamp(createdAtUnix));
        }

        app.addField('Bot pública?', bol(application?.botPublic), true);
        app.addField('Código OAUTH2 requerido?', bol(application?.botRequireCodeGrant), true);

        return context.editOrRespond({
            content: `Puedes conseguir los iconos que uso haciendo ${url('click aquí', `<${ServerLink}>`, 'Server de Iconos')}`,
            embeds: [general, app]
        });
    }
}