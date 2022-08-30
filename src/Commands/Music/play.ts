import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { BaseCommand } from "../../Classes/Command";
import { ExtendedClient } from "../../Classes/ExtendedClient";

export default class PlayCommand extends BaseCommand {
  constructor(client: ExtendedClient) {
    super(client, {
      filename: __filename,
      description: 'Permet de lancer une musique sur le serveur.',
      botPermissions: ['Speak', 'SendMessages'],
      memberPermissions: ['Speak', 'UseApplicationCommands'],
      enabled: true,
      guildOnly: true,
      options: [
        {
          name: 'recherche',
          description: 'Donnez un titre ou un lien.',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true
        }
      ]
    })
  }

  async run(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
      const query = interaction.options.getString('recherche', true);

      const res = await this.client.manager.search(query);

      switch(res.loadType) {

        case 'LOAD_FAILED': {
          interaction.reply({
            embeds: [{
              title: 'Erreur',
              description: `Aucun résultats pour: ${query}`
            }]
          })
          break;
        }

        case 'TRACK_LOADED':
        case 'SEARCH_RESULT': {
          const track = res.tracks[0];
          
          let player = this.client.manager.players.get((interaction.guildId as string));

          if(!player) {
            player = this.client.manager.createPlayer({
             guildId: (interaction.guildId as string),
             voiceChannelId: ((interaction.member as GuildMember).voice.channelId as string),
             textChannelId: interaction.channelId,
             selfDeaf: true,
           });
          }

          if(player.queue.size <= 0 && !player.current) {
          
            // Connect the bot to the voice channel
            await player.connect()

            // Add the track to the queue
            player.queue.add(track);

            // Play track in the voice channel
            player.play()
          } else {

            // Add the track to the queue
            player.queue.add(track)
          }

          interaction.reply({
            embeds: [{
              title: 'Nouvelle musique',
              fields: [
                {
                  name: 'Auteur',
                  value: track.author,
                },
                {
                  name: 'Source',
                  value: track.source
                }
              ]
            }]
          })

          break;
        }

        case 'PLAYLIST_LOADED': {

          let player = this.client.manager.players.get((interaction.guildId as string));

          if(!player) {
            player = this.client.manager.createPlayer({
             guildId: (interaction.guildId as string),
             voiceChannelId: ((interaction.member as GuildMember).voice.channelId as string),
             textChannelId: interaction.channelId,
             selfDeaf: true,
           });
          }

          if(player.queue.size <= 0 && !player.current) {
            
            // Add all tracks to the queue
            res.tracks.forEach((track) => {
              player?.queue.add(track);
            })

            // Connect the bot to the voice channel
            await player.connect()

            // Play track in the voice channel
            player.play()
          } else {

						// Add all tracks to the queue
						res.tracks.forEach((track) => {
							player?.queue.add(track);
						});
					}

          interaction.reply({
						embeds: [
							{
								title: "Nouvelle playlist",
								fields: [
									{
										name: "Titre",
										value: res.playlistInfo.name,
									},
									{
										name: "Musiques",
										value: res.tracks.length.toString(),
									},
								],
							},
						],
					});
          break;
        }
      }
  }
}