// @ts-nocheck
import { createClient, RedisClient } from 'redis'
import { promisify } from 'util'
import logger from './logger'

class Client {
    public url: string
    public client: RedisClient
    public connected: boolean

    public constructor(url: string) {
        this.url = url
        this.client = createClient(url)
        this.connected = this.client.connected

        this.client
            .on('ready', () => logger.info('Redis client ready'))
            .on('error', (error) => {
                if (error.message.includes('connect ECONNREFUSED')) {
                    this.connected = false
                }

                if (this.connected) logger.error(error)
            })
            .on('reconnecting', ({ attempt }) => {
                if (attempt === 1) {
                    logger.warn('Reconnecting redis...')
                } else {
                    this.client.quit()
                    this.connected = false
                    this.client = new Poor()
                }
            })
    }

    public set(key: string, value: any, timeout?: number): Promise<string> {
        if (typeof value === 'object') value = JSON.stringify(value)
        if (this.client instanceof Poor) return this.client.set(key, value)
        return promisify(this.client.set).bind(this.client)(key, value, 'EX', timeout ?? (3 * 100))
    }

    public get(key: string): Promise<string> {
        if (this.client instanceof Poor) return this.client.get(key)
        return promisify(this.client.get).bind(this.client)(key)
    }

    public delete(key: string): Promise<number> {
        if (this.client instanceof Poor) return this.client.delete(key)
        return promisify(this.client.del).bind(this.client)(key)
    }
}

// XD
export class Poor {
    public cache: Record<string, unknown> = {}

    public set(key: string, value: any): string {
        this.cache[key] = value
        return key
    }

    public get(key: string): string | undefined {
        return this.cache[key]
    }

    public delete(key: string) {
        this.cache[key] = null
        delete this.cache[key]
    }
}

export default process.env.mode === 'development' ? new Client(process.env.REDIS_URL!) : new Poor()