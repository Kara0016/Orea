import { ApplicationCommandOption, ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Player } from 'vulkava';

export type BotHandlerType = 'Commands' | 'Events';

export interface CommandOptions {
	filename: string
	description: string
	memberPermissions?: PermissionsString[]
	botPermissions?: PermissionsString[]
	enabled?: boolean
	options?: ApplicationCommandOption[]
	guildOnly?: boolean
}

export interface CommandConf {
	name: string
	enabled: boolean
	botPermissions: PermissionsString[]
}

export interface CommandData {
	interaction: ChatInputCommandInteraction;
	player?: Player;
}

export type ExtendedRESTPostAPIApplicationCommandsJSONBody = RESTPostAPIApplicationCommandsJSONBody & {
	default_member_permissions?: string
	dm_permission?: boolean
}