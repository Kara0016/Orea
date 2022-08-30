import { Application, Client, Collection } from 'discord.js';
import { Config } from '../Types/config';
import { readdir } from 'fs/promises';
import { BotHandlerType } from '../Types/globals';
import { BaseCommand } from './Command';
import { BaseEvent } from './Event';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import ExtendedManager from './ExtendedManager';

export class ExtendedClient extends Client {
	private readonly commandsCollection: Collection<string, BaseCommand>;
	public manager = new ExtendedManager(this);
	constructor (_config: Config) {
		super(_config);
		this.commandsCollection = new Collection<string, BaseCommand>();
		this.init(_config).catch(console.error);
	}

	get commands (): Collection<string, BaseCommand> {
		return this.commandsCollection;
	}

	private async init (config: Config) {
		await this.handler('Events').catch(console.error);
		await this.handler('Commands').catch(console.error);
		await this.login(process.env.TOKEN).catch(console.error);
		if (config.deployCommands) {
			await this.deployCommands().catch(console.error);
		}
	}

	private async handler (type : BotHandlerType): Promise<void> {
		const dirs = await ExtendedClient.getDirs(type);
		if (!dirs || !dirs.length) return;
		for (const dir of dirs) {
			const files = await ExtendedClient.getFilesFromPath(`./dist/${type}/${dir}`);
			for (const file of files) {
				const jsFile = new (require(`../${type}/${dir}/${file}`).default)(this);
				if (type === 'Commands') await this.loadCommand(jsFile);
				else if (type === 'Events') await this.loadEvent(jsFile, file);
			}
		}
	}

	private static async getDirs (type: BotHandlerType): Promise<string[]> {
		return readdir(`./dist/${type}`).then(dirNames => {
			return dirNames.filter(dir => !dir.includes('.'));
		});
	}

	private static async getFilesFromPath (path: string): Promise<string[]> {
		return readdir(path).then(fileNames => {
			return fileNames.filter(file => file.endsWith('.js'));
		});
	}

	private async loadCommand (command: BaseCommand) {
		console.log(`${command.constructor.name} event loaded. 👌`);
		this.commandsCollection.set(command.conf.name, command);
	}

	private async loadEvent (event: BaseEvent, filename: string) {
		console.log(`${event.constructor.name} event loaded. 👌`);
		this.on(filename.split('.')[0], event.run.bind(event));
	}

	private async deployCommands () {
		const commands = this.commands.map(command => command.applicationCommandBody);
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands((this.application as Application).id), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
	}
}