import { Constants, Interaction, Utils } from "detritus-client"

export type OnPage = (page: number, pageObject?: any[]) => Promise<Utils.Embed | Utils.Embed[]> | Utils.Embed | Utils.Embed[]
export type Content = (page: number, pageObject?: any[]) => string

export function FormatEmoji(raw: string) {
    const [, name, id] = raw.replace(/[<|>]/gi, '').split(':')

    return { emoji: { name, id } }
}

export enum Emojis {
    PREVIOUS = "<:sciteluyuY:912792825291210853>",
    CANCEL = "<:yuyuShoot:912793999906062396>",
    NEXT = "<:Yuyuletics:653377241870499841>"
}

export enum EmojiNames {
    PREVIOUS = "previous",
    CANCEL = "cancel",
    NEXT = "next"
}

export interface Options {
    baseArray?: any[]
    content?: Content
    objectsPerPage?: number
    timeout?: number
    onPage: OnPage
    page?: number
    lastPage?: number
    pageObject?: number
}

export default class Paginator implements Options {
    context: Interaction.InteractionContext
    content?: Content
    onPage: OnPage
    baseArray?: any[] = []
    objectsPerPage?= 3
    timeout?= 1000 * 60
    page = 1
    lastPage?: number
    pageObject = 5

    constructor(context: Interaction.InteractionContext, options: Options) {
        this.context = context
        this.onPage = options.onPage

        if (options.content !== undefined)
            this.content = options.content

        if (options.baseArray !== undefined)
            this.baseArray = options.baseArray

        if (options.objectsPerPage !== undefined)
            this.objectsPerPage = options.objectsPerPage

        if (options.timeout !== undefined)
            this.timeout = options.timeout

        this.lastPage = options.lastPage ?? this.baseArray?.length

        console.log(`Paginator started by ${context.user.tag} in channel ${context.channel?.name}`)
    }

    async cancel() {
        const { embed, embeds } = await this.currentPage()
        await this.context.editOrRespond({
            embed,
            embeds,
            content: 'Cancelado.',
            components: []
        })
    }

    get components() {
        const row = new Utils.Components({
            run: this.updatePage.bind(this),
            onError: console.log,
            timeout: this.timeout,
            onTimeout: this.cancel.bind(this)
        })

        row.createButton({
            customId: EmojiNames.PREVIOUS,
            disabled: this.page === 1,
            ...FormatEmoji(Emojis.PREVIOUS)
        })

        row.createButton({
            customId: EmojiNames.CANCEL,
            style: Constants.MessageComponentButtonStyles.DANGER,
            ...FormatEmoji(Emojis.CANCEL)
        })

        row.createButton({
            customId: EmojiNames.NEXT,
            disabled: this.page === this.lastPage,
            ...FormatEmoji(Emojis.NEXT)
        })

        return row
    }

    async currentPage() {
        const pageObject = this.baseArray?.slice(this.pageObject, this.pageObject + this.objectsPerPage!)
        const embed = await this.onPage(this.page, pageObject)
        const content = this.content?.(this.page, pageObject)
        const embeds = Array.isArray(embed)
        return {
            embed: embeds ? undefined : embed,
            embeds: embeds ? embed : undefined,
            content
        }
    }

    setPage(page: number, pageObject?: number) {
        this.page = page
        if (this.objectsPerPage && pageObject) this.pageObject = pageObject
    }

    async createMessage() {
        const { embed, embeds, content } = await this.currentPage()

        return this.context.editOrRespond({
            embed,
            embeds,
            content,
            components: this.components
        })
    }

    async updatePage(context: Utils.ComponentContext) {
        if (context.userId !== this.context.userId) return context.createMessage({
            content: 'No puedes usar esto.',
            flags: Constants.MessageFlags.EPHEMERAL
        })

        switch (context.customId) {
            case EmojiNames.PREVIOUS:
                this.setPage(this.page - 1, this.pageObject - this.objectsPerPage!)
                break

            case EmojiNames.CANCEL:
                await this.cancel()
                return

            case EmojiNames.NEXT:
                this.setPage(this.page + 1, this.pageObject + this.objectsPerPage!)
                break
        }

        await context.respond(Constants.InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE)
            .catch(() => console.info(`Unable to respond interaction in paginator of ${context.user.tag} in #${context.channel?.name}`))
        await this.createMessage()
    }
}