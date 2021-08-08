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

	const stats = await insights(query);
	let info: string = "";
	let infoArray: string[] = [];

	for (let i = 0; i < stats.length; i++) {
		const key = stats[i];
		const victory = key["victory"];
		const defeat = key["defeat"];
		const brawler = key["brawlerName"];
		const map = key["map"];
		const avgTrophyChange = Math.floor(key["trophyChange"]);
		const meanDuration =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const starPlayerCount = key["starPlayer"];
		let starPlayerPercent =
			Math.round(
				((starPlayerCount * 100) / victory + Number.EPSILON) * 100
			) / 100;
		starPlayerPercent = isNaN(starPlayerPercent) ? 0 : starPlayerPercent;

		const appendInfo: string = `**${brawler}** @ ${map}\`\`\`json\nVictories : ${victory}\nDefeats : ${defeat}\nStar Player (%): ${starPlayerPercent}\nAverage Trophy Change : ${avgTrophyChange}\nAverage Duration : ${meanDuration}\n\`\`\`\n`;

		if (info.length + appendInfo.length > 4096) {
			infoArray.push(info);
			info = "";
		}
		info += appendInfo;
	}
	infoArray.push(info);

	for (let i = 0; i < infoArray.length; i++) {
		const embed = client.embed({
			title: `Individual Statistics of ${args[0].toUpperCase()} for mode ${unCamelCase(
				args[1]
			)}`,
			description: infoArray[i],
		});
		await message.channel.send({ embed: embed });
	}
};

export const name: string = "imwstats";
export const aliases: string[] = ["imwst"];
export const description: string =
	"Gives the statistics for the specific mode (can also provide the name of the map for being more specific) for the specific player.";

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
