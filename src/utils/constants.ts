import { Permissions } from "detritus-client/lib/constants";

export enum Colors {
    INVISIBLE = 0x2F3136
}

export enum categories {
    config = "Configuración",
    mod = "Moderación",
    info = "Información",
    misc = "Extra"
}

export const Servers = [
    "876339668956893216", // Manitos Dou
    "882716951233839176"  // Testing
];

export const PermissionUnRaw = Object.freeze({
    [String(Permissions.ADD_REACTIONS)]: 'Añadir Reacciones',
    [String(Permissions.ADMINISTRATOR)]: 'Administrador',
    [String(Permissions.ATTACH_FILES)]: 'Adjuntar Archivos',
    [String(Permissions.BAN_MEMBERS)]: 'Banear Miembros',
    [String(Permissions.CHANGE_NICKNAME)]: 'Cambiar Apodo',
    [String(Permissions.CHANGE_NICKNAMES)]: 'Cambiar Apodos',
    [String(Permissions.CONNECT)]: 'Conectar',
    [String(Permissions.CREATE_INSTANT_INVITE)]: 'Crear Invitación Instantanea',
    [String(Permissions.DEAFEN_MEMBERS)]: 'Silence¿iar miembros',
    [String(Permissions.EMBED_LINKS)]: 'Mandar Enlaces Embed',
    [String(Permissions.KICK_MEMBERS)]: 'Expulsar Miembros',
    // TODO: more permissions translated to spanish
    [String(Permissions.MANAGE_CHANNELS)]: 'Manage Channels',
    [String(Permissions.MANAGE_EMOJIS)]: 'Manage Emojis',
    [String(Permissions.MANAGE_GUILD)]: 'Manage Guild',
    [String(Permissions.MANAGE_MESSAGES)]: 'Manage Messages',
    [String(Permissions.MANAGE_ROLES)]: 'Manage Roles',
    [String(Permissions.MANAGE_THREADS)]: 'Manage Threads',
    [String(Permissions.MANAGE_WEBHOOKS)]: 'Manage Webhooks',
    [String(Permissions.MENTION_EVERYONE)]: 'Mention Everyone',
    [String(Permissions.MOVE_MEMBERS)]: 'Move Members',
    [String(Permissions.MUTE_MEMBERS)]: 'Mute Members',
    [String(Permissions.NONE)]: 'None',
    [String(Permissions.PRIORITY_SPEAKER)]: 'Priority Speaker',
    [String(Permissions.READ_MESSAGE_HISTORY)]: 'Read Message History',
    [String(Permissions.REQUEST_TO_SPEAK)]: 'Request To Speak',
    [String(Permissions.SEND_MESSAGES)]: 'Send Messages',
    [String(Permissions.SEND_TTS_MESSAGES)]: 'Text-To-Speech',
    [String(Permissions.SPEAK)]: 'Speak',
    [String(Permissions.STREAM)]: 'Go Live',
    [String(Permissions.USE_APPLICATION_COMMANDS)]: 'Use Application Commands',
    [String(Permissions.USE_EXTERNAL_EMOJIS)]: 'Use External Emojis',
    [String(Permissions.USE_PRIVATE_THREADS)]: 'Use Private Threads',
    [String(Permissions.USE_PUBLIC_THREADS)]: 'Use Public Threads',
    [String(Permissions.USE_VAD)]: 'Voice Auto Detect',
    [String(Permissions.VIEW_AUDIT_LOG)]: 'View Audit Logs',
    [String(Permissions.VIEW_CHANNEL)]: 'View Channel',
    [String(Permissions.VIEW_GUILD_ANALYTICS)]: 'View Guild Analytics',
});