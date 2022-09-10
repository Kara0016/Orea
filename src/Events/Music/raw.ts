import { IncomingDiscordPayload } from 'vulkava/lib/@types';
import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';

export default class RawEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client);
	}

	run (payload: IncomingDiscordPayload): void {
		this.client.manager.handleVoiceUpdate(payload);
	}
}