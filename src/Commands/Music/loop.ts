import { ApplicationCommandOptionType } from 'discord.js';
import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class LoopCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Manage loop mode of the server.',
			botPermissions: ['SendMessages', 'Speak'],
			memberPermissions: ['UseApplicationCommands', 'Speak'],
			enabled: true,
			guildOnly: true,
			options: [{
				type: ApplicationCommandOptionType.String,
				name: 'mode',
				description: 'Choose a mode.',
				choices: [
					{
						name: 'Track',
						value: 'track'
					},
					{
						name: 'Queue',
						value: 'queue'
					},
					{
						name: 'Off',
						value: 'off'
					}
				],
				required: true
			}]
		});
	}

	run ({ interaction, player }: CommandData): void {
		if (!player) {
			interaction.reply({
				embeds: [{
					description: '❌ | **Nothing is playing right now...**'
				}]
			});
			return;
		}

		const loopMode = interaction.options.getString('mode', true);

		switch(loopMode) {

		case 'track':
			player.setQueueLoop(false);
			player.setTrackLoop(true);
			break;

		case 'queue':
			player.setTrackLoop(false);
			player.setQueueLoop(true);
			break;

		case 'off':
			player.setTrackLoop(false);
			player.setQueueLoop(false);
			break;
		}

		interaction.reply({
			embeds: [{
				description: `Loop mode: **${loopMode}**`
			}]
		});
	}
}