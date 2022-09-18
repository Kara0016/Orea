import { ApplicationCommandOptionType } from 'discord.js';
import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class VolumeCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Change the volume of the bot.',
			botPermissions: ['SendMessages', 'Speak'],
			memberPermissions: ['UseApplicationCommands', 'Speak'],
			enabled: true,
			guildOnly: true,
			options: [{
				type: ApplicationCommandOptionType.Number,
				name: 'pourcentage',
				description: 'The new volume.',
				required: true,
				minValue: 1,
				maxValue: 150
			}]
		});
	}

	run ({ interaction, player }: CommandData): void {
		const value = interaction.options.getNumber('pourcentage', true);

		if(value > 150) {
			interaction.reply({
				embeds: [{
					description: '❌ | **The volume must be bellow 150...**'
				}]
			});
			return;
		}

		player?.filters.setVolume(value, true);

		interaction.reply({
			embeds: [{
				description: `Volume: **${value}**`
			}]
		});
	}
}