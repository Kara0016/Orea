import {ExtendedClient} from './ExtendedClient';

export abstract class BaseEvent {
	protected constructor (protected readonly client: ExtendedClient) {
		this.client = client;
	}
	abstract run (...args: unknown[]) : void
}