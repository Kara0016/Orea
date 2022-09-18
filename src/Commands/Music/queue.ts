import { APIButtonComponent, ApplicationCommandOptionType, ButtonInteraction, ButtonStyle, ComponentType, Interaction } from 'discord.js';
import { DefaultQueue, Track, UnresolvedTrack } from 'vulkava';
import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class QueueCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Display the queue of current guild.',
			memberPermissions: ['UseApplicationCommands', 'Speak'],
			botPermissions: ['Speak', 'SendMessages'],
			enabled: true,
			guildOnly: true,
			options: [{
				name: 'page',
				type: ApplicationCommandOptionType.Number,
				description: 'Specify à page number.',
				required: false
			}]
		});
	}

	run ({ interaction, player }: CommandData): void {
		let pageOptions = interaction.options.getNumber('page') || 0;

		let index = 0;
		const chunckedTracks = this.chunkArray((player?.queue as DefaultQueue).tracks, 20).map((track) => {
			return {
				author: {
					name: `${interaction.guild?.name} queue`,
					icon_url: `${interaction.guild?.iconURL()}`
				},
				description: track.length ? track.map((t) => {
					return `${++index} - ${t?.title.length >= 45 ? t?.title.slice(0, 45) + '...' : t.title} - ${t.author}`;
				}).join('\n') : `Queue is empty. Use </play:${this.client.user?.id}> command to add a track.`,
				fields: [{
					name: 'Current',
					value: `${player?.current?.title} - ${player?.current?.author}`
				}],
				footer: {
					text: `Page: ${Math.round(index / 20)}`,
					icon_url: `${this.client.user?.avatarURL()}`
				},
				timestamp: new Date().toISOString()
			};
		});

		if (chunckedTracks.length === 0) {
			chunckedTracks.push({
				author: {
					name: `${interaction.guild?.name} queue`,
					icon_url: `${interaction.guild?.iconURL()}`
				},
				description: `Queue is empty. Use </play:${this.client.user?.id}> command to add a track.`,
				fields: [{
					name: 'Current',
					value: `${player?.current?.title} - ${player?.current?.author}`
				}],
				footer: {
					text: 'Page: 1/1',
					icon_url: `${this.client.user?.avatarURL()}`
				},
				timestamp: new Date().toISOString()
			});
		}

		if (pageOptions > chunckedTracks.length - 1) {
			interaction.reply({
				embeds: [{
					description: `❌ | **There are currently ${chunckedTracks.length - 1} pages in the queue**`
				}]
			});
			return;
		}

		const prevButton: APIButtonComponent = {
			type: ComponentType.Button,
			label: 'Prev',
			custom_id: 'playlistPrev',
			style: ButtonStyle.Secondary,
			disabled: pageOptions > 0 ? false : true
		};
		const nextButton: APIButtonComponent = {
			type: ComponentType.Button,
			label: 'Next',
			custom_id: 'playlistNext',
			style: ButtonStyle.Secondary,
			disabled: pageOptions + 1 === chunckedTracks.length ? true : false
		};

		interaction.reply({
			embeds: [chunckedTracks[pageOptions]],
			components: [{
				type: ComponentType.ActionRow,
				components: [prevButton, nextButton]
			}],
			fetchReply: true
		}).then((message) => {
			const filter = (i: Interaction) => (i as ButtonInteraction).customId === 'playlistNext' || 'playlistPrev' && i.user.id === interaction.user.id;
			const collector = message.createMessageComponentCollector({ filter, time: 60_000, });
			let isNextDisabled = pageOptions + 1 === chunckedTracks.length ? true : false,
				isPrevDisabled = pageOptions > 0 ? false : true;
			collector.on('collect', btn => {
				btn.deferUpdate();
				if (btn instanceof ButtonInteraction) {
					switch (btn.customId) {
					case 'playlistNext':
						pageOptions++;

						if (isPrevDisabled) {
							prevButton['disabled'] = false;
							isPrevDisabled = false;
						}

						if (pageOptions + 1 === chunckedTracks.length) {
							nextButton['disabled'] = true;
							isNextDisabled = true;
						}

						message.edit({
							embeds: [chunckedTracks[pageOptions]],
							components: [{
								type: ComponentType.ActionRow,
								components: [prevButton, nextButton]
							}]
						});
						break;

					case 'playlistPrev':
						pageOptions--;

						if (isNextDisabled) {
							nextButton['disabled'] = false;
							isNextDisabled = false;
						}

						if (pageOptions === 0) {
							prevButton['disabled'] = true;
							isPrevDisabled = true;
						}

						message.edit({
							embeds: [chunckedTracks[pageOptions]],
							components: [{
								type: ComponentType.ActionRow,
								components: [prevButton, nextButton]
							}]
						});
						break;
					}
				}
			});

			collector.on('end', () => {
				message.edit({
					components: []
				});
				collector.stop();
			}
			);
		});
	}


	/**
 * It takes an array and returns an array of arrays, each of which is no longer than the specified
 * size
 * @param {(Track|UnresolvedTrack)[]} arr - The array to be chunked
 * @param {number} size - The size of each chunk.
 * @returns An array of arrays.
 */
	chunkArray (arr: (Track | UnresolvedTrack)[], size = 10) {
		const chunks = [];
		for (let i = 0; i < arr.length; i += size) {
			const chunk = arr.slice(i, i + size);
			chunks.push(chunk);
		}
		return chunks;
	}
}