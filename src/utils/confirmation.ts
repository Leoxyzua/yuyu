import { Utils, Constants, Structures, Interaction } from "detritus-client"
import { BaseCollection } from "detritus-utils"

export type OnCallback = (context: Utils.ComponentContext) => Promise<any>

export interface ConfirmationOptions {
    onConfirm: OnCallback
    onCancel: OnCallback

    onTimeout?: Utils.ComponentOnTimeout
    timeout?: number
}


export function disableButtons(row: BaseCollection<number, Structures.MessageComponentActionRow>): Utils.ComponentActionRow {
    const components = row.first()?.components.map((button) => {
        if (!(button instanceof Structures.MessageComponentSelectMenu)) {
            button.disabled = true
        }

        return button
    })

    return new Utils.ComponentActionRow({ components })
}

export class Confirmation {
    readonly row: Utils.ComponentActionRow

    context: Interaction.InteractionContext
    onConfirm: OnCallback
    onCancel: OnCallback

    onTimeout?: Utils.ComponentOnTimeout
    timeout?: number

    constructor(context: Interaction.InteractionContext, options: ConfirmationOptions) {
        this.context = context
        this.onConfirm = options.onConfirm
        this.onCancel = options.onCancel

        this.onTimeout = options.onTimeout ?? (() => undefined)
        this.timeout = options.timeout ?? 7500

        this.row = new Utils.Components({
            timeout: this.timeout,
            onTimeout: this.onTimeout,
            onError: console.error,
        }).createActionRow()
    }

    start() {
        [{
            label: 'Yes',
            style: Constants.MessageComponentButtonStyles.SUCCESS,
            run: (context: Utils.ComponentContext) => {
                if (context.user.id !== this.context.user.id)
                    return context.respond(Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                        content: 'Este botón no es para ti.',
                        flags: Constants.MessageFlags.EPHEMERAL,
                    })

                return this.onConfirm(context)
            },
            onError: console.error
        },
        {
            label: 'No',
            style: Constants.MessageComponentButtonStyles.DANGER,
            run: (context: Utils.ComponentContext) => {
                if (context.user.id !== this.context.user.id)
                    return context.respond(Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                        content: 'Este botón no es para ti.',
                        flags: Constants.MessageFlags.EPHEMERAL,
                    })

                return this.onCancel(context)
            },
            onError: console.error
        }].forEach((button) => this.row.addButton(button))

        return this.row
    }
}