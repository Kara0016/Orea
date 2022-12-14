import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { BaseCommand } from '../../Classes/Command';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { CommandData } from '../../Types/globals';

export default class PlayCommand extends BaseCommand {
	constructor (client: ExtendedClient) {
		super(client, {
			filename: __filename,
			description: 'Play a music to the server.',
			botPermissions: ['Speak', 'SendMessages'],
			memberPermissions: ['Speak', 'UseApplicationCommands'],
			enabled: true,
			guildOnly: true,
			options: [
				{
					name: 'search',
					description: 'Search a title or url.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		});
	}

	async run ({ interaction }: CommandData): Promise<void> {
		const query = interaction.options.getString('search', true);

		const { loadType, tracks, playlistInfo } = await this.client.manager.search(query);

		switch(loadType) {

		case 'LOAD_FAILED': {
			interaction.reply({
				embeds: [{
					title: 'Erreur',
					description: `No results for: ${query}`
				}]
			});
			break;
		}

		case 'TRACK_LOADED':
		case 'SEARCH_RESULT': {
			const track = tracks[0];
          
			let player = this.client.manager.players.get((interaction.guildId as string));

			if(!player) {
				player = this.client.manager.createPlayer({
					guildId: (interaction.guildId as string),
					voiceChannelId: ((interaction.member as GuildMember).voice.channelId as string),
					textChannelId: interaction.channelId,
					selfDeaf: true,
				});
			}

			if(player.queue.size <= 0 && !player.current) {
          
				// Connect the bot to the voice channel
				await player.connect();

				// Add the track to the queue
				player.queue.add(track);

				// Play track in the voice channel
				player.play();
			} else {

				// Add the track to the queue
				player.queue.add(track);
			}

			interaction.reply({
				embeds: [{
					title: 'Track added',
					fields: [
						{
							name: 'Author',
							value: track.author,
						},
						{
							name: 'Source',
							value: track.source
						}
					]
				}],
				fetchReply: true
			}).then((msg) => {
				setTimeout(() => {
					if(msg.deletable) {
						msg.delete();
					}
				}, 6000);
			});

			break;
		}

		case 'PLAYLIST_LOADED': {

			let player = this.client.manager.players.get((interaction.guildId as string));

			if(!player) {
				player = this.client.manager.createPlayer({
					guildId: (interaction.guildId as string),
					voiceChannelId: ((interaction.member as GuildMember).voice.channelId as string),
					textChannelId: interaction.channelId,
					selfDeaf: true,
				});
			}

			if(player.queue.size <= 0 && !player.current) {
            
				// Add all tracks to the queue
				tracks.forEach((track) => {
					player?.queue.add(track);
				});

				// Connect the bot to the voice channel
				await player.connect();

				// Play track in the voice channel
				player.play();
			} else {

				// Add all tracks to the queue
				tracks.forEach((track) => {
					player?.queue.add(track);
				});
			}

			interaction.reply({
				embeds: [
					{
						title: 'New playlist',
						fields: [
							{
								name: 'Title',
								value: playlistInfo.name,
							},
							{
								name: 'Tracks',
								value: tracks.length.toString(),
							},
						],
					},
				],
			});
			break;
		}
		}
	}
}