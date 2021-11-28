import { Command } from 'detritus-client'

export const replyOptions: Command.EditOrReply = {
    reference: true,
    allowedMentions: { repliedUser: false, parse: [] }
}

export class BaseCommand<ParsedArgsFinished = Command.ParsedArgs> extends Command.Command<ParsedArgsFinished> {
    permissionsIgnoreClientOwner = true
    triggerTypingAfter = 1000
}