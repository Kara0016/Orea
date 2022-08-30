import { Vulkava } from "vulkava";
import { ExtendedClient } from "./ExtendedClient";
import { nodes } from "../Config/nodes";

/**
 * @constructor {ExtendedClient} client
 */

export default class ExtendedManager extends Vulkava {
	constructor(client: ExtendedClient) {
		/**
		 * @super {VulkavaOptions} options
		 * @param {NodeOptions[]} options.nodes
		 * @param {Function} options.sendWs
		 * @param {string} defaultSearchSource
		 * @param {SpotifyConfig} options.spotify
		 */

		super({
			nodes: nodes,
      sendWS(guildId, payload) {
				client.guilds.cache.get(guildId)?.shard.send(payload);
			},
			defaultSearchSource: "youtubemusic",
			spotify: {
				clientId: process.env.SPOTIFY_ID,
				clientSecret: process.env.SPOTIFY_SECRET,
			},
		});
	}

	/**
	 * @param {string} id - The id of the client instance.
	 */
	public init(id: string) {
		super.start(id);
	}
}
