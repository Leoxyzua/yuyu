import { InteractionContext } from "detritus-client/lib/interaction"
import { BaseCommand } from "../../../basecommand"
import {
    SomeRandomApiURL as apiUrl,
    SomeRandomApiAnimalRequest as requestData,
    Colors
} from "../../../../../utils/constants"
import { Embed } from "detritus-client/lib/utils"
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants"

export interface CommandArgs {
    fact: boolean | undefined
}

export async function sraRequest(context: InteractionContext, path: string) {
    const res = await context.client.rest.get({
        dataOnly: false,
        url: apiUrl,
        route: {
            path
        }
    })

    return res.json()
}

export class BaseSRACommand extends BaseCommand {
    public path: string
    public sub: string

    public constructor(path: string, sub: `de ${string}`) {
        super({
            name: path.split('/')[2].replace('_', '-'),
            description: `Obten una imagen aleatoria ${sub}`,
            options: [{
                name: 'fact',
                description: 'Quiers obtener un dato en inglés sobre este animal?',
                type: ApplicationCommandOptionTypes.BOOLEAN
            }],
            metadata: { category: 'fun' }
        })
        this.sub = sub
        this.path = path
    }

    public async run(context: InteractionContext, args: CommandArgs) {
        const data = await sraRequest(context, this.path) as requestData
        const embed = new Embed()
            .setImage(data.image)
            .setFooter(`Host: ${apiUrl.slice(8)}`)
            .setColor(Colors.INVISIBLE)

        if (args.fact) embed.setDescription(data.fact)

        return this.safeReply(context, { embed })
    }
}