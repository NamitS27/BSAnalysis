import { Run } from "../../interfaces/event";
import { Message } from "discord.js";
import { Command } from "../../interfaces/command";

export const run: Run = async (client, message: Message) => {
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLowerCase().startsWith("bs!")
	)
		return;
	const args: string[] = message.content
		.slice("bs!".length)
		.trim()
		.split(/ +/g);
	const cmd: string = args.shift();
	const command: Command =
		client.commands.get(cmd) ||
		client.commands.get(client.aliases.get(cmd));
	if (!command) return;
	command
		.run(client, message, args)
		.catch((reason: any) =>
			message.channel.send(
				client.embed(
					{ description: `An error came: ${reason}` },
					message
				)
			)
		);
};

export const name: string = "message";
