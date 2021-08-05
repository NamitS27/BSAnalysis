import { Run } from "../interfaces/command";
import { brawlBrosInsights } from "../../utils/mapAnalysis";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = split(messageContent, " ", 2);
	args.shift();

	if (args.length < 1 || args.length > 2) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embed: errorMessage });
		return;
	}
	const query = { mode: args[0] };
	if (args.length == 2) query["map"] = args[1];
	let stats = await brawlBrosInsights(query);
	let info: string = "";
	let infoArray: string[] = [];

	for (let i = 0; i < stats.length; i++) {
		const key = stats[i];
		const victory = key["victory"];
		const defeat = key["defeat"];
		const brawlerTeam: string[] = key["team"];
		const map = key["map"];
		const md =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const appendInfo: string = `**${brawlerTeam[0]}, ${brawlerTeam[1]} & ${brawlerTeam[2]}**\`\`\`json\nMap: ${map}\nVictories : ${victory}\nDefeats : ${defeat}\nAverage Duration : ${md}\n\`\`\`\n`;

		if (info.length + appendInfo.length > 4096) {
			infoArray.push(info);
			info = "";
		}
		info += appendInfo;
	}
	infoArray.push(info);

	for (let i = 0; i < infoArray.length; i++) {
		const embed = client.embed({
			title: `Statistics for ${args[0]} played by three of us!`,
			description: infoArray[i],
		});
		await message.channel.send({ embed: embed });
	}
};

export const name: string = "bbmwstats";
export const aliases: string[] = ["bbmwst"];
export const description: string =
	"Gives the statistics for all types of 3v3 battles for the specified player.";

function split(string, separator, n) {
	var split = string.split(separator);
	if (split.length <= n) return split;
	var out = split.slice(0, n - 1);
	out.push(split.slice(n - 1).join(separator));
	return out;
}
