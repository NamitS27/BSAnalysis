import consola, { Consola } from "consola";
import {
	Client,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
	Intents,
	Collection,
} from "discord.js";
import glob from "glob";
import { promisify } from "util";

import { Command } from "../interfaces/command";
import { Event } from "../interfaces/event";

const globPromise = promisify(glob);

class Bot extends Client {
	public prefix: string = "?";
	public logger: Consola = consola;
	public commands: Collection<string, Command> = new Collection();
	public aliases: Collection<string, string> = new Collection();
	public descriptions: Collection<string, string> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public usages: Collection<string, string> = new Collection();

	public constructor() {
		super({
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		});
	}

	public async start(): Promise<void> {
		this.login(process.env.DISCORD_TOKEN);
		const commandFiles = await globPromise(
			`${__dirname}/../commands/**/*{.ts,.js}`
		);
		commandFiles.map(async (value: string) => {
			const file: Command = await import(value);
			this.commands.set(file.name, file);
			if (file.aliases?.length) {
				file.aliases.map((alias: string) =>
					this.aliases.set(alias, file.name)
				);
			}
			if (file.description?.length) {
				this.descriptions.set(file.name, file.description);
			}
			this.usages.set(file.name, file.usage);
		});

		const eventFiles = await globPromise(
			`${__dirname}/../events/**/*{.ts,.js}`
		);
		eventFiles.map(async (value: string) => {
			const file: Event = await import(value);
			this.events.set(file.name, file);
			this.on(file.name, file.run.bind(null, this));
		});
	}

	public embed(options: MessageEmbedOptions): MessageEmbed {
		return new MessageEmbed({
			...options,
			color: "RANDOM",
		});
	}
}

export { Bot };
