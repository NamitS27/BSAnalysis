import { Run } from "../../interfaces/event";
import { Message } from "discord.js";
import { Command } from "../../interfaces/command";

export const run: Run = async (client, message: Message) => {
	const prefix: string = client.prefix;
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLowerCase().startsWith(prefix)
	)
		return;
	const args: string[] = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd: string = args.shift();
	const command: Command =
		client.commands.get(cmd) ||
		client.commands.get(client.aliases.get(cmd));
	if (!command) return;
	command.run(client, message, args).catch((reason: any) => {
		client.logger.error(reason);
		message.channel.send({
			embeds: [
				client.embed({
					description: `An error occured due to ${reason}`,
				}),
			],
		});
	});
};

export const name: string = "message";
