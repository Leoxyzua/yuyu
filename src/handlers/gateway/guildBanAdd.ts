import { GatewayClientEvents } from "detritus-client"
import getBans, { fetchBans } from "../../utils/getbans"

const GuildBanAdd = async ({ guild, user }: GatewayClientEvents.GuildBanAdd) => {
    if (!guild) return
    const bans = await getBans(guild)

    if (!bans.map((ban) => ban.user.id).includes(user.id)) { // if the bans comes from cache, update them
        await fetchBans(guild)
    }
}

export default GuildBanAdd