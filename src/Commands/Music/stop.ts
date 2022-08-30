import { ChatInputCommandInteraction, CacheType } from "discord.js";
import { Player } from 'vulkava';
import { BaseCommand } from "../../Classes/Command";
import { ExtendedClient } from "../../Classes/ExtendedClient";

export default class StopCommand extends BaseCommand {
  constructor(client: ExtendedClient) {
    super(client, {
      filename: __filename,
      description: 'Permet de stopper la musique sur le serveur.',
      enabled: true,
      guildOnly: true,
      botPermissions: ['Speak', 'SendMessages'],
      memberPermissions: ['Speak', 'SendMessages']
    })
  }

  async run(interaction: ChatInputCommandInteraction<CacheType>, player: Player): Promise<void> {
    if(!player) {
      interaction.reply({
        embeds: [{
          title: 'Erreur',
          description: "Il n'y a aucune musique en cours sur ce serveur."
        }]
      });
      return
    }

    try {
      await player.destroy()
      interaction.reply({
        embeds: [{
          description: 'Le lecteur a été détruit.'
        }]
      })
    } catch (err) {
      interaction.reply({
        embeds: [{
          description: 'Une erreur est survenue. Veuillez réessayer.'
        }]
      })
    }
    
  }
}