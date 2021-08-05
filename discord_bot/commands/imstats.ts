import { Run } from "../interfaces/command";
import { individualStats } from "../../utils/mapAnalysis";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	let args: string[] = messageContent.split(" ");
	args.shift();
	if (args.length === 0 || args.length > 1) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embed: errorMessage });
		return;
	}

	let stats = await individualStats(args[0]);
	stats = stats[0]["modewise"];
	let info: string = "";
	for (let i = 0; i < stats.length; i++) {
		const key = stats[i];
		const mode = unCamelCase(key["_id"]);
		const victory = key["victory"];
		const defeat = key["defeat"];
		const tc = Math.floor(key["trophyChange"]);
		const md =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const nsp = key["starPlayer"];
		info += `**${mode}**\n\`\`\`json\nVictories : ${victory}\nDefeats : ${defeat}\n# Star Player : ${nsp}\nAverage Trophy Change : ${tc}\nAverage Duration : ${md}\n\`\`\`\n`;
	}

	const statsEmbed = client.embed({
		title: `Individual Modewise Statistics of ${args[0].toUpperCase()}`,
		description: info,
	});

	await message.channel.send({ embed: statsEmbed });
};

export const name: string = "imstats";
export const aliases: string[] = ["imst"];
export const description: string =
	"Gives the modewise statistics for all types of 3v3 battles for the specificed player.";

function unCamelCase(str) {
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
