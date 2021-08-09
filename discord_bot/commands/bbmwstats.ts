import { Run } from "../interfaces/command";
import { brawlBrosInsights } from "../../utils/mapAnalysis";
import { MessageEmbed } from "discord.js";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = split(messageContent, " ", 2);
	args.shift();

	if (args.length < 1 || args.length > 2) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embeds: [errorMessage] });
		return;
	}
	const query = { mode: args[0] };
	if (args.length == 2) query["map"] = args[1];

	let stats = await brawlBrosInsights(query);
	let info: string = "";
	let embeds: MessageEmbed[] = [];

	for (let i = 0; i < stats.length; i++) {
		const key = stats[i];
		const victory = key["victory"];
		const defeat = key["defeat"];
		const brawlerTeam: string[] = key["team"];
		const map = key["map"];
		const meanDuration =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const appendInfo: string = `**${brawlerTeam[0]}, ${brawlerTeam[1]} & ${brawlerTeam[2]}**\`\`\`json\nMap: ${map}\nVictories : ${victory}\nDefeats : ${defeat}\nAverage Duration : ${meanDuration} s\n\`\`\`\n`;

		if (info.length + appendInfo.length > 4096) {
			const embed = client.embed({
				title: `Statistics for ${unCamelCase(
					args[0]
				)} played by **Brawl Bros**!`,
				description: info,
			});
			embeds.push(embed);
			info = "";
		}
		info += appendInfo;
	}
	const embed = client.embed({
		title: `Statistics for ${unCamelCase(
			args[0]
		)} played by **Brawl Bros**!`,
		description: info,
	});
	embeds.push(embed);

	await message.channel.send({ embeds: embeds });
};

export const name: string = "bbmwstats";
export const aliases: string[] = ["bbmwst"];
export const description: string =
	"Gives the statistics for the specific mode (can also provide the name of the map for being more specific) for the **Brawl Bros**.";
export const usage: string = "`bbmwstats <mode> [map]`";

function split(str: string, separator, numberOfSplits: number): string[] {
	let split = str.split(separator);
	if (split.length <= numberOfSplits) return split;
	let out = split.slice(0, numberOfSplits - 1);
	out.push(split.slice(numberOfSplits - 1).join(separator));
	return out;
}

function unCamelCase(str: string): string {
	return (
		str
			// insert a space between lower & upper
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			// space before last upper in a sequence followed by lower
			.replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
			// uppercase the first character
			.replace(/^./, function (str) {
				return str.toUpperCase();
			})
	);
}
