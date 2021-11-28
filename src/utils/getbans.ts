import { RestResponses } from "detritus-client/lib/rest/types"
import { Guild, User } from "detritus-client/lib/structures"
import redis from "../redis"

export default async function getBans(guild: Guild): Promise<RestResponses.FetchGuildBans> {
    const cache = await redis.get(`bans-${guild.id}`)

    // imagine add typings for this
    if (cache) return JSON.parse(cache).map((ban: any) => {
        ban.user = new User(guild.client, ban.user)
        return ban
    })

    return await fetchBans(guild)
}

export async function fetchBans(guild: Guild) {
    const bans = await guild.fetchBans().then((bans) => {
        console.log(`Fetching guild bans in ${guild.name} [${guild.id}]`)

        if (bans.length) {
            redis.set(`bans-${guild.id}`, JSON.stringify(bans.toJSON()))
            return bans
        }
    })

    return bans!
}