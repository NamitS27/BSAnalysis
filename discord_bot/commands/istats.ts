import { Run } from "../interfaces/command";
import { individualStats } from "../../utils/mapAnalysis";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = messageContent.split(" ");
	args.shift();

	if (args.length !== 1) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embeds: [errorMessage] });
		return;
	}

	let stats = await individualStats(args[0]);
	stats = stats[0]["overall"][0];
	const fields = [
		{ name: "Victories", value: `${stats["victory"]}`, inline: true },
		{ name: "Defeats", value: `${stats["defeat"]}`, inline: true },
		{
			name: "Star Player (%)",
			value: `${
				Math.round(
					((stats["starPlayer"] * 100) /
						(stats["starPlayer"] + stats["defeat"]) +
						Number.EPSILON) *
						100
				) / 100
			} %`,
			inline: true,
		},
		{
			name: "Average Trophy Change",
			value: `${Math.floor(stats["trophyChange"])}`,
		},
		{
			name: "Average Duration",
			value: `${
				Math.round((stats["meanDuration"] + Number.EPSILON) * 100) / 100
			} s`,
		},
	];

	const statsEmbed = client.embed({
		title: `Individual Statistics`,
		description: `Gives the statistics for all types of 3v3 battles played by ${toProperCase(
			args[0]
		)}`,
		fields,
	});

	await message.channel.send({ embeds: [statsEmbed] });
};

export const name: string = "istats";
export const aliases: string[] = ["ist"];
export const description: string =
	"Gives the statistics for all types of 3v3 battles for the specified player.";
export const usage: string = "`istats <person>`";

function toProperCase(str: string): string {
	return str.replace(/(^|\s)\S/g, function (str) {
		return str.toUpperCase();
	});
}
