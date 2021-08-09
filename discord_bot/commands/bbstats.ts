import { Run } from "../interfaces/command";
import { brawlBrosStats } from "../../utils/mapAnalysis";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = messageContent.split(" ");
	args.shift();

	if (args.length > 0) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embeds: [errorMessage] });
		return;
	}

	let stats = await brawlBrosStats();
	stats = stats[0]["overall"][0];

	const fields = [
		{ name: "Victories", value: `${stats["victory"]}`, inline: true },
		{ name: "Defeats", value: `${stats["defeat"]}`, inline: true },
		{
			name: "Average Duration",
			value: `${
				Math.round((stats["meanDuration"] + Number.EPSILON) * 100) / 100
			} s`,
			inline: true,
		},
	];

	const statsEmbed = client.embed({
		title: `Statistics for the 3v3 games played by the "**Brawl Bros**"`,
		description: description,
		fields,
	});

	await message.channel.send({ embeds: [statsEmbed] });
};

export const name: string = "bbstats";
export const aliases: string[] = ["bbst"];
export const description: string =
	"Gives the statistics for all types of 3v3 battles played by Namit, Devarsh & Harvish.";
export const usage: string = "`bbstats`";
