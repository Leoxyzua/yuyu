import { Command, CommandClient, Utils, Constants } from 'detritus-client';
import { exec } from 'child_process';
import { inspect, promisify } from 'util';

const promiseExec = promisify(exec);

import { BaseCommand, replyOptions } from '../basecommand';

export const COMMAND_NAME = 'eval';

export interface CommandArgs {
    code: string;
    depth: number;
    nodepth?: boolean;
    exec?: boolean
    async?: boolean;
}

// not interested in message commands, but the "activateOnEdits" is hot /shrug
export default class EvalCommand extends BaseCommand {
    constructor(client: CommandClient) {
        super(client, {
            label: 'code',
            name: COMMAND_NAME,
            args: [
                {
                    name: 'depth',
                    type: Number,
                    default: 0
                },
                {
                    name: 'nodepth',
                    type: Boolean,
                },
                {
                    name: 'exec',
                    type: Boolean
                },
                {
                    name: 'async',
                    type: Boolean
                }
            ]
        });
    }

    onBeforeRun(context: Command.Context, args: CommandArgs) {
        return context.user.isClientOwner && !!args.code
    }

    async run(context: Command.Context, { code, exec, async, depth, nodepth }: CommandArgs) {
        const { matches } = Utils.regex(Constants.DiscordRegexNames.TEXT_CODEBLOCK, code);

        if (matches.length && matches[0].text) code = matches[0].text;

        let result;

        try {
            if (exec) {
                const { stdout, stderr } = await promiseExec(code);
                result = (stdout || stderr) || 'Without output';

            } else {
                result = async ? await eval(`(async () => { ${code} })();`) : await Promise.resolve(eval(code));

                if (typeof (result) !== 'string') result = inspect(result, { depth: nodepth ? null : depth });
            }
        } catch (error: any) {
            result = error.raw ? inspect(error.raw, { depth: 7 }) : error.stack;
        }

        return context.editOrReply({
            content: Utils.Markup.codeblock(result, {
                language: 'js'
            }),
            ...replyOptions
        });
    }
}