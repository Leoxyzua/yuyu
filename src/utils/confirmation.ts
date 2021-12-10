import { Interaction, Utils } from "detritus-client"
import {
    MessageFlags,
    InteractionCallbackTypes,
    MessageComponentButtonStyles
} from "detritus-client/lib/constants"
import { MessageComponentActionRow, MessageComponentSelectMenu } from "detritus-client/lib/structures"
import { BaseCollection } from "detritus-utils"
import logger from "../logger"

export type OnCallback = (context: Utils.ComponentContext) => Promise<any>

export interface ConfirmationOptions {
    onConfirm: OnCallback
    onCancel: OnCallback

    onTimeout?: Utils.ComponentOnTimeout
    timeout?: number
}


export function disableButtons(row: BaseCollection<number, MessageComponentActionRow>): Utils.ComponentActionRow {
    const components = row.first()?.components.map((button) => {
        if (!(button instanceof MessageComponentSelectMenu)) {
            button.disabled = true
        }

        return button
    })

    return new Utils.ComponentActionRow({ components })
}

export class Confirmation {
    public readonly row: Utils.ComponentActionRow

    public context: Interaction.InteractionContext
    public onConfirm: OnCallback
    public onCancel: OnCallback

    public onTimeout?: Utils.ComponentOnTimeout
    public timeout?: number

    public constructor(context: Interaction.InteractionContext, options: ConfirmationOptions) {
        this.context = context
        this.onConfirm = options.onConfirm
        this.onCancel = options.onCancel

        this.onTimeout = options.onTimeout ?? (() => undefined)
        this.timeout = options.timeout ?? 7500

        this.row = new Utils.Components({
            timeout: this.timeout,
            onTimeout: this.onTimeout,
            onError: logger.error,
        }).createActionRow()
    }

    public start() {
        [{
            label: 'Yes',
            style: MessageComponentButtonStyles.SUCCESS,
            run: (context: Utils.ComponentContext) => {
                if (context.user.id !== this.context.user.id)
                    return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                        content: 'Este botón no es para ti.',
                        flags: MessageFlags.EPHEMERAL,
                    })

                return this.onConfirm(context)
            },
            onError: logger.error
        },
        {
            label: 'No',
            style: MessageComponentButtonStyles.DANGER,
            run: (context: Utils.ComponentContext) => {
                if (context.user.id !== this.context.user.id)
                    return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                        content: 'Este botón no es para ti.',
                        flags: MessageFlags.EPHEMERAL,
                    })

                return this.onCancel(context)
            },
            onError: logger.error
        }].forEach((button) => this.row.addButton(button))

        return this.row
    }
}