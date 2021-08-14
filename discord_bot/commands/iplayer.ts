import { Run } from "../interfaces/command";
import { getPlayerInfo } from "../../utils/playerInfo";
import { MessageEmbed } from "discord.js";

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

	const stats = await getPlayerInfo(args[0]);
	if (!stats) {
		return;
	}

	let starPoints: number = 0;
	let trophyDrop: number = 0;
	for (let i = 0; i < stats["brawlers"].length; i++) {
		let brawler = stats["brawlers"][i];
		let brawlerCurrTrophies = brawler["trophies"];

		let calcResult = calc(brawlerCurrTrophies);
		starPoints += calcResult[1];
		trophyDrop += calcResult[0];
	}

	const title = `${stats["name"]}`;
	const fields = [
		{ name: "Trophies", value: `${stats["trophies"]}`, inline: true },
		{
			name: "Highest Trophies",
			value: `${stats["highestTrophies"]}`,
			inline: true,
		},
		{
			name: "CC Qualified",
			value: `${stats["isQualifiedFromChampionshipChallenge"]}`,
			inline: true,
		},
		{
			name: "Exp Level",
			value: `${stats["expLevel"]}`,
			inline: true,
		},
		{
			name: "Exp Points",
			value: `${stats["expPoints"]}`,
			inline: true,
		},
		{
			name: "# Brawlers",
			value: `${stats["brawlers"].length}`,
			inline: true,
		},
		{
			name: "3v3 Wins",
			value: `${stats["3vs3Victories"]}`,
			inline: true,
		},
		{ name: "Duo Wins", value: `${stats["duoVictories"]}`, inline: true },
		{ name: "Solo Wins", value: `${stats["soloVictories"]}`, inline: true },
		{
			name: "*Current Star Points Gain",
			value: `${starPoints}`,
			inline: true,
		},
		{
			name: "*Current Trophies Drop",
			value: `${trophyDrop}`,
			inline: true,
		},
	];

	const statsEmbed = client.embed({
		title,
		description,
		fields,
		footer: {
			text: `Player Tag : ${stats["tag"]}  |  *Trophy Road Season Stats`,
		},
	});

	await message.channel.send({ embeds: [statsEmbed] });
};

export const name: string = "iplayer";
export const aliases: string[] = ["ip"];
export const description: string =
	"Gives the overall information about the player's so far gameplay.";
export const usage: string = "`iplayer <person>`";

function calc(brawlerTrophy: number) {
	const powerPointMatrix: number[][] = [
		[501, 524, 500, 20],
		[525, 549, 524, 50],
		[550, 574, 549, 70],
		[575, 599, 574, 80],
		[600, 624, 599, 90],
		[625, 649, 624, 100],
		[650, 674, 649, 110],
		[675, 699, 674, 120],
		[700, 724, 699, 130],
		[725, 749, 724, 140],
		[750, 774, 749, 150],
		[775, 799, 774, 160],
		[800, 824, 799, 170],
		[825, 849, 824, 180],
		[850, 874, 849, 190],
		[875, 899, 874, 200],
		[900, 924, 885, 210],
		[925, 949, 900, 220],
		[950, 974, 920, 230],
		[975, 999, 940, 240],
		[1000, 1049, 960, 250],
		[1050, 1099, 980, 260],
		[1100, 1149, 1000, 270],
		[1150, 1199, 1020, 280],
		[1200, 1249, 1040, 290],
		[1250, 1299, 1060, 300],
		[1300, 1349, 1080, 310],
		[1350, 1399, 1100, 320],
		[1400, 1449, 1120, 330],
		[1450, 1499, 1140, 340],
	];
	for (let i = 0; i < powerPointMatrix.length; i++) {
		let row = powerPointMatrix[i];
		if (brawlerTrophy >= row[0] && brawlerTrophy <= row[1]) {
			return [brawlerTrophy - row[2], row[3]];
		}
	}
	return brawlerTrophy >= 1500 ? [brawlerTrophy - 1150, 350] : [0, 0];
}
