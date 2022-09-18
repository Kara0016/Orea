import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from 'discord.js';
import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class CurrentCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Display the current song.',
			botPermissions: ['SendMessages', 'Speak'],
			memberPermissions: ['UseApplicationCommands', 'Speak'],
			enabled: true,
			guildOnly: true,
			options: [{
				type: ApplicationCommandOptionType.String,
				name: 'private',
				description: 'Send this embed as private ?',
				choices: [
					{
						name: 'Yes',
						value: 'yes'
					},
					{
						name: 'No',
						value: 'no'
					}
				]
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

		const isPrivate = interaction.options.getString('private', false);
		const { current } = player;

		interaction.reply({
			embeds: [{
				author: {
					name: `${current?.title}`,
					icon_url: `${interaction.guild?.iconURL()}`,
				},
				thumbnail: {
					url: `${current?.thumbnail}`
				},
				fields: [
					{ name: 'Author', value: `${current?.author}`, inline: true },
					{ name: 'Duration', value: `${current?.duration}`, inline: true }
				],
				footer: {
					text: `${current?.source}`,
					icon_url: `${this.client.user?.displayAvatarURL()}`
				},
				timestamp: new Date().toISOString()
			}],
			components: [{
				type: ComponentType.ActionRow,
				components: [{
					type: ComponentType.Button,
					style: ButtonStyle.Link,
					label: 'Song url',
					url: `${current?.uri}`
				}]
			}],
			ephemeral: isPrivate === 'yes' ? true : false
		});
	}
}