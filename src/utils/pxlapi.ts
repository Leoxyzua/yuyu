import { Client } from "detritus-client-rest"

export namespace RequestParameters {
    export interface Glitch {
        iterations?: number
        amount?: number
        gif?: boolean
        count?: number
        delay?: number
        images: string[]
    }

    export interface Lego {
        groupSize?: number
        scale?: boolean
        images: string[]
    }

    export interface Thonkify {
        text: string
    }
}

export class PxlClient {
    public token: string
    public rest: Client
    public url = "https://api.pxlapi.dev/"

    public constructor(token: string, rest: Client) {
        this.token = token
        this.rest = rest
    }

    /** For image manipulation */
    public async request(path: 'glitch', body: RequestParameters.Glitch): Promise<Buffer>
    public async request(path: 'lego', body: RequestParameters.Lego): Promise<Buffer>
    public async request(path: 'thonkify', body: RequestParameters.Thonkify): Promise<Buffer>
    public async request(path: string, body: any): Promise<Buffer> {
        const response = await this.rest.post({
            url: this.url,
            route: {
                path
            },
            body,
            headers: { Authorization: `Application ${this.token}` }
        })

        return response
    }

    public async glitch(images: string[]) {
        return this.request('glitch', {
            images,
            gif: true
        })
    }

    public async thonkify(text: string) {
        return this.request('thonkify', {
            text
        })
    }

    public async lego(images: string[]) {
        return this.request('lego', {
            images
        })
    }
}