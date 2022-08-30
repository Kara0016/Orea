import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandInteraction } from 'discord.js';

export default class Ping extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Get response time of the bot.',
			memberPermissions: ['SendMessages', 'ManageMessages']
		});
	}

	async run (interaction: CommandInteraction) {
		await interaction.reply('Pong!');
	}
}