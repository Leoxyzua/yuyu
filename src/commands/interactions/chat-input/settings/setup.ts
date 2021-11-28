import { Interaction, Utils } from "detritus-client"
import { Permissions, InteractionCallbackTypes, MessageComponentButtonStyles } from "detritus-client/lib/constants"
import { Role, Emoji } from "detritus-client/lib/structures"
import { BaseCommand } from "../../basecommand"
import { Error } from "../../../../utils/icons"

export const COMMAND_NAME = "setup"

export default class SetupSettingsCommand extends BaseCommand {
    name = COMMAND_NAME
    description = "Configuración del server"

    permissions = [Permissions.ADMINISTRATOR]

    async run(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: '.',
            components: this.baseComponents(undefined, context)
        })
    }

    async listenButtons(context: Interaction.InteractionContext, componentContext: Utils.ComponentContext) {
        await componentContext.respond(InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE)

        switch (componentContext.customId) {
            case 'cancel':
                await this.reset(context)
                break

            case 'lock_emojis':
                await this.chooseRoleToLock(context)
                break
        }
    }

    async reset(context: Interaction.InteractionContext) {
        return this.run(context)
    }

    async chooseRoleToLock(context: Interaction.InteractionContext) {
        const row = this.createRow(context)

        row.createSelectMenu({
            placeholder: 'Selecciona...',
            options: context.guild!.roles
                .filter((role) => !role.managed && context.me!.canEditRole(role))
                .map((role) => ({
                    label: role.name,
                    value: role.id,
                    emoji: role.iconUrl ?? undefined
                })),
            run: (ctx) => {
                return this.chooseEmojisToLock(context, context.guild!.roles.get(ctx.data.values?.[0]!)!)

            },
            maxValues: 1,
            minValues: 1
        })

        this.addCancelButton(row)

        return context.editOrRespond({
            content: 'Elije un rol.',
            components: row
        })
    }


    async chooseEmojisToLock(context: Interaction.InteractionContext, role: Role) {
        const emojis = await context.guild!.fetchEmojis()
        const row = this.createRow(context)

        row.createSelectMenu({
            placeholder: 'Selecciona...',
            options: emojis
                .map((emoji) => ({
                    label: emoji.name,
                    value: emoji.id,
                    emoji: emoji.toString()
                })),
            run: (ctx) => {
                const ems = context.guild!.emojis
                    .filter((role => ctx.data.values?.some((val) => val === role.id)!))
                return this.lockEmoji(context, role, ems)
            },
            minValues: 1,
            maxValues: 5
        })

        this.addCancelButton(row)

        return context.editOrRespond({
            content: 'Elije un(os) emoji(s)',
            components: row
        })
    }

    async lockEmoji(
        context: Interaction.InteractionContext,
        role: Role,
        emojis: Emoji[]
    ) {
        for (const emoji of emojis) {
            await emoji.edit({
                roles: context.guild!.roles.filter((r) => r.id !== role.id).map((r) => r.id)
            })
        }

        const components = this.addCancelButton(this.createRow(context))

        return context.editOrRespond({
            content: 'oka',
            components
        })
    }

    addCancelButton(row: Utils.Components) {
        return row.addButton({
            label: 'Cancelar',
            customId: 'cancel',
            style: MessageComponentButtonStyles.DANGER,
            emoji: Error
        })
    }

    createRow(context: Interaction.InteractionContext) {
        const row = new Utils.Components({
            run: async (componentContext) => {
                return this.listenButtons(context, componentContext)
            }
        })

        return row
    }

    baseComponents(row?: Utils.Components, context?: Interaction.InteractionContext) {
        if (!row && context) row = this.createRow(context)

        row?.addButton({
            label: 'Lock emojis',
            customId: 'lock_emojis'
        })

        return row
    }
}