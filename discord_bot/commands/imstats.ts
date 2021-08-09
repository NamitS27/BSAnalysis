import { Run } from "../interfaces/command";
import { individualStats } from "../../utils/mapAnalysis";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = messageContent.split(" ");
	args.shift();

	if (args.length != 1 || !(args[0] in ["namit", "devarsh", "harvish"])) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments or person doesn't exisit.`,
		});
		await message.channel.send({ embeds: [errorMessage] });
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
		const avgTrophyChange = Math.floor(key["trophyChange"]);
		const meanDuration =
			Math.round((key["meanDuration"] + Number.EPSILON) * 100) / 100;
		const starPlayerCount = key["starPlayer"];
		let starPlayerPercent =
			Math.round(
				((starPlayerCount * 100) / victory + Number.EPSILON) * 100
			) / 100;
		starPlayerPercent = isNaN(starPlayerPercent) ? 0 : starPlayerPercent;

		info += `**${mode}**\n\`\`\`json\nVictories : ${victory}\nDefeats : ${defeat}\nStar Player (%): ${starPlayerPercent}\nAverage Trophy Change : ${avgTrophyChange}\nAverage Duration (sec): ${meanDuration}\n\`\`\`\n`;
	}

	const statsEmbed = client.embed({
		title: `${toProperCase(args[0])}'s modewise statistics`,
		description: info,
	});

	await message.channel.send({ embeds: [statsEmbed] });
};

export const name: string = "imstats";
export const aliases: string[] = ["imst"];
export const description: string =
	"Gives the modewise statistics for all types of 3v3 battles for the specificed player.";
export const usage: string = "`imstats <person> <mode>`";

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

function toProperCase(str: string): string {
	return str.replace(/(^|\s)\S/g, function (str) {
		return str.toUpperCase();
	});
}
