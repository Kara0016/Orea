import { ExtendedClient } from '../../Classes/ExtendedClient';
import { BaseEvent } from '../../Classes/Event';

export default class Ready extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client);
	}

	run (): void {
		console.log(`${this.client.user?.tag} is ready!`);
		this.client.manager.init((this.client.user?.id as string));
	}
}