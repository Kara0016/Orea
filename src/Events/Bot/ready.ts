import { ExtendedClient } from '../../Classes/ExtendedClient';
import { BaseEvent } from '../../Classes/Event';
import { EventEmitters } from '../../Types/globals';

export default class Ready extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Client
		});
	}

	run (): void {
		console.log(`${this.client.user?.tag} is ready!`);
		this.client.manager.init((this.client.user?.id as string));
	}
}