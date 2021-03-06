import { GatewayClientEvents, Interaction, Utils } from "detritus-client"
import {
    MessageFlags,
    InteractionCallbackTypes,
    MessageComponentButtonStyles
} from "detritus-client/lib/constants"
import { Message } from "detritus-client/lib/structures"
import logger from "../logger"
import { Succes, Warning } from "./icons"

export type OnPage = (page: number, pageObject?: any[]) => Promise<Utils.Embed | Utils.Embed[]> | Utils.Embed | Utils.Embed[]
export type Content = (page: number, pageObject?: any[]) => string

export enum Emojis {
    PREVIOUS = "<:sciteluyuY:912792825291210853>",
    CANCEL = "<:yuyuShoot:912793999906062396>",
    JUMP = "<a:Yuyubounce:601703816919777280>",
    NEXT = "<:Yuyuletics:653377241870499841>"
}

export enum EmojiNames {
    PREVIOUS = "previous",
    CANCEL = "cancel",
    JUMP = "jump",
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
    public context: Interaction.InteractionContext
    public content?: Content
    public onPage: OnPage
    public baseArray?: any[] = []
    public objectsPerPage?: number
    public timeout?= 1000 * 60
    public page = 1
    public lastPage?: number
    public pageObject = 0
    public jump: {
        message?: Message | null,
        active: boolean
    } = {
            active: false
        }

    public constructor(context: Interaction.InteractionContext, options: Options) {
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

        if (options.pageObject !== undefined)
            this.pageObject = options.pageObject

        this.lastPage = options.lastPage ??
            (this.objectsPerPage && this.baseArray?.length)
            ? Math.ceil(this.baseArray?.length! / this.objectsPerPage!)
            : this.baseArray?.length

        context.client.subscribe('messageCreate', (payload) => this.onMessage(payload))
        logger.debug(`Paginator started by ${context.user.tag} in channel ${context.channel?.name}`)
    }

    public async cancel() {
        const { embed, content, embeds } = await this.currentPage()
        await this.context.editOrRespond({
            embed,
            embeds,
            content: content ? `~~${content}~~` : undefined,
            components: []
        })
    }

    public get components() {
        const row = new Utils.Components({
            run: this.updatePage.bind(this),
            onError: logger.error,
            timeout: this.timeout,
            onTimeout: this.cancel.bind(this)
        })

        if (!(this.page === 1 && this.page === this.lastPage)) {
            row.createButton({
                customId: EmojiNames.PREVIOUS,
                disabled: this.page === 1,
                emoji: Emojis.PREVIOUS
            })

            row.createButton({
                customId: EmojiNames.CANCEL,
                style: MessageComponentButtonStyles.DANGER,
                emoji: Emojis.CANCEL
            })

            row.createButton({
                customId: EmojiNames.JUMP,
                style: this.jump.active ? MessageComponentButtonStyles.DANGER : undefined,
                emoji: Emojis.JUMP
            })

            row.createButton({
                customId: EmojiNames.NEXT,
                disabled: this.page === this.lastPage,
                emoji: Emojis.NEXT
            })
        }

        return row
    }

    public async currentPage() {
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

    public setPage(page: number, pageObject?: number) {
        this.page = page
        if (this.objectsPerPage && typeof pageObject === 'number')
            this.pageObject = pageObject

    }

    public async createMessage() {
        const { embed, embeds, content } = await this.currentPage()

        return this.context.editOrRespond({
            embed,
            embeds,
            content,
            components: this.components
        })
    }

    public async onMessage({ message }: GatewayClientEvents.MessageCreate) {
        if (
            message.fromBot ||
            message.author.id !== this.context.userId ||
            !message.content ||
            !this.jump.message
        ) return

        const page = parseInt(message.content)
        if (isNaN(page) || page > this.lastPage! || 1 > page) return this.throwInvalidPage()

        this.setPage(page, this.objectsPerPage! * page)
        await this.clearMessage(`${Succes} Saltando a la p??gina **${page}**`)
        await this.createMessage()
    }

    public async throwInvalidPage() {
        if (!this.jump.message) return

        await this.context.editMessage(this.jump.message.id, {
            content: `${Warning} P??gina inv??lida, escribe de nuevo una v??lida o pulsa de nuevo el boton para cancelar.`
        })
    }

    public async clearMessage(content = `${Succes} Cancelado.`) {
        if (!this.jump.message) return

        await this.context.editMessage(this.jump.message.id, {
            content
        })

        this.jump.active = false
        this.jump.message = null
    }

    public async updatePage(context: Utils.ComponentContext) {
        if (context.userId !== this.context.userId) return context.createMessage({
            content: 'No puedes usar esto.',
            flags: MessageFlags.EPHEMERAL
        })

        await context.respond(InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE)
            .catch(() => logger.warn(`Unable to respond interaction in paginator of ${context.user.tag} in #${context.channel?.name}`))

        switch (context.customId) {
            case EmojiNames.PREVIOUS:
                this.setPage(this.page - 1, this.pageObject - this.objectsPerPage!)
                break

            case EmojiNames.CANCEL:
                return this.cancel()

            case EmojiNames.JUMP:
                if (this.jump.active) await this.clearMessage()
                else {
                    this.jump.message = await context.createMessage({
                        content: '??A qu?? p??gina quieres ir?',
                        flags: MessageFlags.EPHEMERAL
                    })
                    this.jump.active = true
                }
                break

            case EmojiNames.NEXT:
                this.setPage(this.page + 1, this.pageObject + this.objectsPerPage!)
                break
        }

        await this.createMessage()
    }
}