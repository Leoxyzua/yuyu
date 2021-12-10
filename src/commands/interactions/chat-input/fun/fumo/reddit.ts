import { InteractionContext } from "detritus-client/lib/interaction"
import { FumoSubReddits } from "../../../../../utils/constants"
import { Commands } from "../../../../../utils/parameters"
import { BaseSubCommand } from "../../../basecommand"

export const COMMAND_NAME = "reddit"

export class FumoRedditCommand extends BaseSubCommand {
    public name = COMMAND_NAME
    public description = "Muestra posts de reddit relcionados a los fumos"
    public triggerLoadingAfter = 2000

    public constructor() {
        super({
            options: [{
                name: 'subreddit',
                description: 'En qué reddit quieres buscar?',
                required: true,
                choices: FumoSubReddits.map((subreddit) => ({ name: subreddit, value: subreddit }))
            }]
        })
    }

    public async run(context: InteractionContext, args: Commands.Fumo.arguments.reddit) {
        return Commands.Fumo.reddit(context, args)
    }
}