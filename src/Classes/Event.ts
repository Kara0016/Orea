import { EventOptions } from '../Types/globals';
import {ExtendedClient} from './ExtendedClient';

export abstract class BaseEvent {
	emitter: number;
	protected constructor (protected readonly client: ExtendedClient, options: EventOptions) {
		this.client = client;
		this.emitter = options.emitter;
	}
	abstract run (...args: unknown[]) : void
}