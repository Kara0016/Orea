import { ExtendedClient } from '../../Classes/ExtendedClient';
import { BaseEvent } from '../../Classes/Event';
import { AutocompleteInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js';
import { EventEmitters } from '../../Types/globals';

export default class InteractionCreate extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Client
		});
	}

	run (interaction: Interaction): void {
		if (interaction.isCommand()) {
			this.client.emit('commandInteractionCreate', (interaction as ChatInputCommandInteraction));
		}

		if (interaction.isAutocomplete()) {
			this.client.emit('autocompleteInteraction', (interaction as AutocompleteInteraction));
		}
	}
}