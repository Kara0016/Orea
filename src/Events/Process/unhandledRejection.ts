import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { EventEmitters } from '../../Types/globals';

export default class UnhandledRejectionEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Process
		});
	}

	run (reason: Error, promise: Promise<unknown>): void {
		console.log('Unhandled Rejection at:', promise, 'reason:', reason.message);
	}
}