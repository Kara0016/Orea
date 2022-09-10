import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { EventEmitters } from '../../Types/globals';

export default class ManagerReadyEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Client
		});
	}

	run (): void {
		console.log('Music deployed !');
	}
}