import { AutocompleteInteraction } from 'discord.js';
import { BaseEvent } from '../../Classes/Event';
import { ExtendedClient } from '../../Classes/ExtendedClient';

export default class AutocompleteInteractionEvent extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client);
	}

	async run (interaction: AutocompleteInteraction): Promise<void> {
      
		const value = interaction.options.getFocused(true).value;

		if(value.length <= 1) return;

		const { loadType, playlistInfo, tracks } = await this.client.manager.search(value);

		switch(loadType) {

		case 'SEARCH_RESULT': {
        
			interaction.respond(tracks.map((track) => { return {
				name: `${track.title} - ${track.author}`,
				value: track.uri.slice(0, 100)
			}; }));
			break;
		}

		case 'PLAYLIST_LOADED': {
			let matched = '';
			const plateforms = ['spotify', 'deezer', 'apple', 'youtube', 'soundcloud'] as const;
			plateforms.forEach((plateform: string) => {
				if(value.match(plateform)) {
					matched += plateform;
				}
			});

			interaction.respond([{
				name: `${playlistInfo.name} - (Playlist ${matched})`,
				value: value.slice(0, 100)
			}]);
			break;
		}

		default: {
			interaction.respond([{
				name: 'Aucuns Résultats',
				value: 'https://www.youtube.com/watch?v=tnVij0qC6No&list=PLmOSlR4kXpLir3PnLhT1jUjSWhHesAgQU&index=7'
			}]);
		}
		}
	}
}