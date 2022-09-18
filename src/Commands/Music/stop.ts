import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class StopCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Destroy the current player.',
			enabled: true,
			guildOnly: true,
			botPermissions: ['Speak', 'SendMessages'],
			memberPermissions: ['Speak', 'SendMessages']
		});
	}

	async run ({ interaction, player }: CommandData): Promise<void> {
		try {
			await player?.destroy();
			interaction.reply({
				embeds: [{
					description: 'The player has been destroyed.'
				}]
			});
		} catch (err) {
			interaction.reply({
				embeds: [{
					description: 'An error occured. Please retry.'
				}]
			});
		}
    
	}
}