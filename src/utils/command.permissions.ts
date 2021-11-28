import { ShardClient } from "detritus-client"
import { RequestTypes } from 'detritus-client-rest'
import { inspect } from 'util'

export function removeElement(array: any[], target: any) {
    return array.filter(element => {
        return element !== target
    })
}

export interface SubPermissions {
    id: string
    permission: boolean
    type: number
}

export interface DataPermission extends Omit<RequestTypes.BulkOverwriteApplicationGuildCommandsPermission, 'permissions'> {
    permissions: SubPermissions[]
}

export function createPermission(commandId: string, data: DataPermission[], object: SubPermissions) {
    const has = findPermission(commandId, data)
    if (has && has.permissions.length < 10) has.permissions.push(object)
    else data.push({
        id: commandId,
        permissions: [object]
    })

    data
}

export function findPermission(commandId: string, data: DataPermission[]) {
    return data.find((data) => data.id === commandId)
}

async function handlePermissions(client: ShardClient) {
    const data: Array<DataPermission> = []

    for (const guild of client.guilds.toArray()) {
        if (process.env.mode !== 'development') continue
        for (const command of client.interactionCommandClient?.commands.toArray()!) {
            if (!['mod', 'config'].includes(command.metadata.category) || !command.permissions || command.defaultPermission !== false) continue
            if (!command.ids.size && !command.ids.first()) continue
            const id = command.ids.first()!

            for (const role of guild.roles.filter((role) => role.can(command.permissions!) && role.id !== guild.id && !role.managed)) {
                createPermission(id, data, {
                    id: role.id,
                    permission: true,
                    type: 1
                })
            }

            createPermission(id, data, {
                id: guild.ownerId,
                permission: true,
                type: 2
            })
        }


        for (const sub of data) {
            for (const permission of sub.permissions) {
                if (!(guild.members.has(permission.id) || guild.roles.has(permission.id)))
                    sub.permissions = removeElement(sub.permissions, permission)
            }
        }

        await client.rest.bulkOverwriteApplicationGuildCommandsPermissions(
            client.userId,
            guild.id,
            // @ts-expect-error
            data
        ).catch((error) => {
            if (error.errors?.['0']?._errors?.[0]?.code === 'APPLICATION_COMMANDS_INVALID_ID') return
            console.error(inspect(error, { depth: 8 }))
        })
    }

    return data
}

export default handlePermissions