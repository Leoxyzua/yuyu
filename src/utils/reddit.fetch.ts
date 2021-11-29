import fetch from 'node-fetch'

export interface FetchOptions {
    subreddit: string
    limit?: number
    nsfw?: boolean
    onlyImages?: boolean
    videos?: boolean
}

export interface RedditPost {
    id: string
    score: number
    title: string
    author: string
    thumbnail: string
    url: string
    created: number
    subreddit: string
    over_18: boolean
    is_video: boolean
    num_comments: number
    permalink: string
    crosspost_parent_list: RedditPost[]
}

export interface RedditFetch {
    data: {
        children: Array<{
            kind: string,
            data: RedditPost
        }>
    }
}

export default async function (options: FetchOptions): Promise<null | RedditPost[]> {
    const json = await (await fetch(`https://www.reddit.com/r/${options.subreddit}/new.json?limit=${options.limit ?? 25}`)).json() as RedditFetch
    if (!json?.data) return null
    const { children } = json.data

    if (!children.length) return null

    const data = children
        .filter(({ data }) => {
            if (data.is_video && !options.videos) return false
            if (data.over_18 && !options.nsfw) return false

            return true
        })
        .slice(0, options.limit)
        .map(({ data }) => {
            if (!data.is_video) data.thumbnail = data.url
            return data
        })

    return data
}