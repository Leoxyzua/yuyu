import {
    CommandClient,
    Constants,
    InteractionCommandClient,
    ShardClient
} from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants.js';

import './database';
import './utils/detritus.esm';

import handlers from './handlers';
import handlePermissions from './utils/command.permissions';

const { BOT_TOKEN } = process.env;

const client = new ShardClient(BOT_TOKEN!, {
    gateway: {
        identifyProperties: {
            $browser: 'Discord Android'
        },
        loadAllMembers: true,
        intents: [
            GatewayIntents.GUILDS,
            GatewayIntents.GUILD_MEMBERS,
            GatewayIntents.GUILD_BANS,
            GatewayIntents.GUILD_PRESENCES,
            GatewayIntents.GUILD_MESSAGES
        ],
        presence: {
            activities: ['cat', 'dog'].map((animal) => ({ name: `the ${animal}`, type: Constants.ActivityTypes.LISTENING }))
        }
    },
    imageFormat: 'png',
    cache: {
        typings: false,
        emojis: false,
        // just 10 mins
        messages: { expire: 60 * 100 * 100 }
    }
});

const interactionClient = new InteractionCommandClient(client);
const messageClient = new CommandClient(client, {
    activateOnEdits: true,
    prefix: '-'
});

handlers(client, interactionClient);

try {
    await client.run();

    await interactionClient.addMultipleIn('src/commands/interactions');
    await interactionClient.run();

    await handlePermissions(client);

    await messageClient.addMultipleIn('src/commands/message');
    await messageClient.run();
} catch (error) {
    console.error('Something went wrong with the clients', error)
}

console.log(`Logged in as ${client.user!.tag}, with ${interactionClient.commands.size} [/] commands and a shard count of ${client.shardCount} in ${client.guilds.size} guilds.`);