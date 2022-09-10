import { IncomingDiscordPayload } from 'vulkava/lib/@types';
import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';
import { EventEmitters } from '../../Types/globals';

export default class RawEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Client
		});
	}

	run (payload: IncomingDiscordPayload): void {
		this.client.manager.handleVoiceUpdate(payload);
	}
}