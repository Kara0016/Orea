import { ExtendedClient } from '../../Classes/ExtendedClient';
import { BaseEvent } from '../../Classes/Event';
import { AutocompleteInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js';

export default class InteractionCreate extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client);
	}

	run (interaction: Interaction): void {
		if (interaction.isCommand()) {

			const player = this.client.manager.players.get((interaction.guildId as string));

			this.client.emit('commandInteractionCreate', (interaction as ChatInputCommandInteraction), player);
		}

		if (interaction.isAutocomplete()) {
			this.client.emit('autocompleteInteraction', (interaction as AutocompleteInteraction))
		}
	}
}