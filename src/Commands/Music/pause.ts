import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class VolumeCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Pause/resume the track.',
			botPermissions: ['SendMessages', 'Speak'],
			memberPermissions: ['UseApplicationCommands', 'Speak'],
			enabled: true,
			guildOnly: true,
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

		player.pause(!player.paused);

		interaction.reply({
			embeds: [{
				description: `Track ${player.paused ? 'paused' : 'resumed'}.`
			}]
		});
	}
}