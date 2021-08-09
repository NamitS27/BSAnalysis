import { Run } from "../interfaces/command";
import {
	MessageActionRow,
	MessageSelectMenu,
	SelectMenuInteraction,
} from "discord.js";

export const run: Run = async (client, message) => {
	const commands = client.commands.map((cmd) => {
		return {
			label: cmd.name,
			value: cmd.name,
		};
	});

	const initialEmbed = client.embed({
		title: "Help",
		description: "Please select a command for fetching its information",
		footer: {
			text: `Commands Prefix: \`${client.prefix}\``,
		},
	});

	const components: any = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("help-menu")
			.setPlaceholder("Please select a command!")
			.setDisabled(false)
			.addOptions(commands)
	);

	// const comp = components(false);

	const initialMessage = await message.channel.send({
		embeds: [initialEmbed],
		components: [components],
	});

	const filter: any = (interaction) =>
		interaction.user.id === message.author.id;

	const collector = message.channel.createMessageComponentCollector({
		filter,
		componentType: "SELECT_MENU",
		time: 300000,
	});

	collector.on("collect", (interaction: SelectMenuInteraction) => {
		const selected: string = interaction.values[0];
		const command: any = client.commands.find(
			(cmd) => cmd.name === selected
		);
		const embed = client.embed({
			title: `${command.name}`,
			description: `${command.description}\n\n<>: required, []: optional\nUsage: ${command.usage}\n\nAliases: ${command.aliases}`,
			footer: {
				text: `command perefix : \`${client.prefix}\``,
			},
		});

		interaction.update({ embeds: [embed] });
	});

	collector.on("end", () => {
		initialMessage.delete();
	});
};

export const name: string = "help";
export const description: string =
	"Gives the information about various commands";
export const aliases: string[] = ["h"];
export const usage: string = "`help`";
