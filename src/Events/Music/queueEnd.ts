import { Player } from 'vulkava';
import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { EventEmitters } from '../../Types/globals';

export default class QueueEndEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Manager
		});
	}

	run (player: Player) {
		if(!player.current) {
			player.destroy();
		}
	}
}