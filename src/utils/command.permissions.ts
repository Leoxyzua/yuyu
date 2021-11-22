import { ShardClient } from "detritus-client";
import { RequestTypes } from 'detritus-client-rest';
import { inspect } from 'util';
import { Servers } from "./constants";

export interface SubPermissions {
    id: string, permission: boolean, type: number
}

export interface DataPermission extends Omit<RequestTypes.BulkOverwriteApplicationGuildCommandsPermission, 'permissions'> {
    permissions: SubPermissions[]
}

export function createPermission(commandId: string, data: DataPermission[], object: SubPermissions) {
    const has = findPermission(commandId, data);
    if (has) has.permissions.push(object)
    else data.push({
        id: commandId,
        permissions: [object]
    });

    return data;
}

export function findPermission(commandId: string, data: DataPermission[]) {
    return data.find((data) => data.id === commandId);
}

async function handlePermissions(client: ShardClient) {
    const data: Array<DataPermission> = [];

    for (const guild of client.guilds.toArray()) {
        if (!Servers.includes(guild.id)) continue;
        for (const command of client.interactionCommandClient?.commands.toArray()!) {
            if (!['mod', 'config'].includes(command.metadata.category) || !command.permissions) continue;

            for (const role of guild.roles.filter((role) => role.can(command.permissions!) && role.id !== guild.id && !role.managed)) {
                if (command.ids.size && command.ids.first()) {
                    const id = command.ids.first()!;

                    [{
                        id: role.id,
                        permission: true,
                        type: 1
                    }, {
                        id: guild.ownerId,
                        permission: true,
                        type: 2
                    }].map((object) => createPermission(id, data, object));
                }
            }
        }

        await client.rest.bulkOverwriteApplicationGuildCommandsPermissions(
            client.userId,
            guild.id,
            // @ts-expect-error
            data
        ).catch((error) => {
            if (error.errors['0']._errors[0].code === 'APPLICATION_COMMANDS_INVALID_ID') return;
            console.error(inspect(error, { depth: 8 }))
        });

        console.log('Setting permissions in guild', guild.name);
    }
}

export default handlePermissions;