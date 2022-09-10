import { TextChannel } from 'discord.js';
import { Player, Track } from 'vulkava';
import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { EventEmitters } from '../../Types/globals';

export default class TrackStartEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Manager
		});
	}

	run (player: Player, track: Track): void {
		const channel = this.client.channels.cache.get((player.textChannelId as string));

		if(channel instanceof TextChannel) {
			channel.send({
				embeds: [{
					title: 'New Track',
					fields: [
						{
							name: 'Title',
							value: track.title
						},
						{
							name: 'Author',
							value: track.author
						}
					],
					thumbnail: {
						url: (track.thumbnail as string)
					},
					footer: {
						text: `${this.client.user?.username}`,
						icon_url: `${this.client.user?.avatarURL()}`
					},
					timestamp: new Date().toISOString()
				}]
			});
		}
	}
}