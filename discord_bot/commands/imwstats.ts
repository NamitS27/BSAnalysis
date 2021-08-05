import { Run } from "../interfaces/command";
import { insights } from "../../utils/mapAnalysis";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = split(messageContent, " ", 4);
	args.shift();

	if (args.length < 2 || args.length > 3) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embed: errorMessage });
		return;
	}
	const query = { tag: args[0], mode: args[1] };
	if (args.length == 3) query["map"] = args[2];
	let stats = await insights(query);
	let info: string = "";
	let infoArray: string[] = [];

	for (let i = 0; i < stats.length; i++) {
		const key = stats[i];
		const victory = key["victory"];
		const defeat = key["defeat"];
		const brawler = key["brawlerName"];
		const map = key["map"];
		const tc = Math.floor(key["trophyChange"]);
		const md =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const nsp = key["starPlayer"];
		const appendInfo: string = `**${brawler}**\`\`\`json\nMap: ${map}\nVictories : ${victory}\nDefeats : ${defeat}\n# Star Player : ${nsp}\nAverage Trophy Change : ${tc}\nAverage Duration : ${md}\n\`\`\`\n`;

		if (info.length + appendInfo.length > 4096) {
			infoArray.push(info);
			info = "";
		}
		info += appendInfo;
	}
	infoArray.push(info);

	for (let i = 0; i < infoArray.length; i++) {
		const embed = client.embed({
			title: `Individual Statistics of ${args[0].toUpperCase()} for mode ${
				args[1]
			}`,
			description: infoArray[i],
		});
		await message.channel.send({ embed: embed });
	}
};

export const name: string = "imwstats";
export const aliases: string[] = ["imwst"];
export const description: string =
	"Gives the statistics for all types of 3v3 battles for the specified player.";

function split(string, separator, n) {
	var split = string.split(separator);
	if (split.length <= n) return split;
	var out = split.slice(0, n - 1);
	out.push(split.slice(n - 1).join(separator));
	return out;
}
