import { Run } from "../interfaces/command";
import { brawlBrosStats } from "../../utils/mapAnalysis";
import { MessageEmbed } from "discord.js";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	let args: string[] = messageContent.split(" ");
	args.shift();

	if (args.length > 0) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embeds: [errorMessage] });
		return;
	}

	let stats = await brawlBrosStats();
	stats = stats[0]["modewise"];

	let info: string = "";
	let embeds: MessageEmbed[] = [];
	for (let i = 0; i < stats.length; i++) {
		const key = stats[i];
		const mode = unCamelCase(key["_id"]);
		const victory = key["victory"];
		const defeat = key["defeat"];
		const md =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const appendInfo: string = `**${mode}**\n\`\`\`json\nVictories : ${victory}\nDefeats : ${defeat}\nAverage Duration : ${md} s\n\`\`\`\n`;
		if (info.length + appendInfo.length > 4096) {
			const embed = client.embed({
				title: `Modewise Statistics of the "Brawl Bros"`,
				description: info,
			});
			embeds.push(embed);
			info = "";
		}
		info += appendInfo;
	}
	const embed = client.embed({
		title: `Modewise Statistics of the "Brawl Bros"`,
		description: info,
	});
	embeds.push(embed);

	await message.channel.send({ embeds: embeds });
};

export const name: string = "bbmstats";
export const aliases: string[] = ["bbmst"];
export const description: string =
	"Gives the modewise statistics for all types of 3v3 battles played by Namit, Devarsh & Harvish.";
export const usage: string = "`bbmstats`";

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
