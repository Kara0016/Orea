import { ApplicationCommandOptionType } from 'discord.js';
import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class SkipCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Skip to the next track',
			botPermissions: ['SendMessages', 'Speak'],
			memberPermissions: ['UseApplicationCommands', 'Speak'],
			enabled: true,
			guildOnly: true,
			options: [{
				type: ApplicationCommandOptionType.Number,
				name: 'to',
				description: 'The number of tracks to skip',
				required: false,
			}]
		});
	}

	run ({ interaction, player }: CommandData): void {

		const amount = interaction.options.getNumber('to', false) || 1;

		player?.skip(amount);

		interaction.reply({
			embeds: [{
				description: `${amount} track${amount > 1 ? 's' : ''} skiped.`
			}]
		});
	}
}