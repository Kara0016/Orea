import { ClientOptions } from 'discord.js';

export type Config = ClientOptions & {
    deployCommands: boolean
}