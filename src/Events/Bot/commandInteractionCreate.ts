import { ExtendedClient } from '../../Classes/ExtendedClient';
import { BaseEvent } from '../../Classes/Event';
import { ChatInputCommandInteraction, Guild, GuildMember, PermissionsString, TextChannel } from 'discord.js';
import { EventEmitters } from '../../Types/globals';

export default class CommandInteractionCreate extends BaseEvent {
	constructor (client: ExtendedClient) {
		super(client, {
			emitter: EventEmitters.Client
		});
	}

	async run (interaction: ChatInputCommandInteraction) {
		const cmd = this.client.commands.get(interaction.commandName);
		if (!cmd) return await interaction.reply({
			content: ':x: error'
		});
		if (interaction.inGuild()) {
			const neededPermissions: PermissionsString[] = [];
			cmd.conf.botPermissions.forEach((perm) => {
				if(!(interaction.channel as TextChannel).permissionsFor((interaction.guild as Guild).members.me as GuildMember).has(perm)){
					neededPermissions.push(perm);
				}
			});
			if(neededPermissions.length > 0) {
				return interaction.reply({
					content: 'J\'ai besoin des permissions suivantes pour executer cette commande:' + neededPermissions.map((p) => `\`${p}\``).join(', '),
					ephemeral: true
				});
			}
			
			
		}
		
		const player = this.client.manager.players.get((interaction.guildId as string));
		
		if(!(interaction.member as GuildMember).voice.channelId) {
			interaction.reply({
				embeds: [{
					description: '❌ | **You need to join a vocal channel to use this command...**'
				}]
			});
			return;
		}

		if(interaction.commandName !== 'play') {
			if (!player) {
				interaction.reply({
					embeds: [{
						description: '❌ | **Nothing is playing right now...**'
					}]
				});
				return;
			}


			if((interaction.member as GuildMember).voice.channelId !== interaction.guild?.members.me?.voice.channelId) {
				interaction.reply({
					embeds: [{
						description: '❌ | **You must be in the same channel as me...**'
					}]
				});
				return;
			}
		}
		
		return cmd.run({
			interaction: interaction,
			player: player
		});
	}
}