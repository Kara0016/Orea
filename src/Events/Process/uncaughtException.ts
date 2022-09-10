import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { EventEmitters } from '../../Types/globals';

export default class UncaughtExceptionEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Process
		});
	}

	run (error: Error, origin: string): void {
		console.log('Caught exception at: ', error, 'Exception origin: ', origin);
	}
}