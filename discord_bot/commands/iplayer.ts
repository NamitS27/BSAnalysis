import { Run } from "../interfaces/command";
import { getPlayerInfo } from "../../utils/playerInfo";
import { MessageEmbed } from "discord.js";

export const run: Run = async (client, message) => {
	const messageContent: string = message.content;
	const args: string[] = messageContent.split(" ");
	args.shift();
	if (args.length === 0 || args.length > 1) {
		const errorMessage = client.embed({
			description: `Invalid number of arguments.`,
		});
		await message.channel.send({ embed: errorMessage });
		return;
	}

	const stats = await getPlayerInfo(args[0]);
	const title = `Information of ${stats["name"]}'s profile`;
	const fields = [
		{ name: "Trophies", value: stats["trophies"], inline: true },
		{
			name: "Highest Trophies",
			value: stats["highestTrophies"],
			inline: true,
		},
		{
			name: "CC Qualified",
			value: stats["isQualifiedFromChampionshipChallenge"],
			inline: true,
		},
		{
			name: "Exp Level",
			value: stats["expLevel"],
			inline: true,
		},
		{
			name: "Exp Points",
			value: stats["expPoints"],
			inline: true,
		},
		{
			name: "3 vs 3 Victories",
			value: stats["3vs3Victories"],
		},
		{ name: "Duo Victories", value: stats["duoVictories"], inline: true },
		{ name: "Solo Victories", value: stats["soloVictories"], inline: true },
		{ name: "# Brawlers", value: stats["brawlers"].length },
	];

	// let embeds: MessageEmbed[] = [];
	// let counter: number = 0;
	// let fieldsForBrawlers = [];
	// for (let i = 0; i < stats["brawlers"].length; i++) {
	// 	let brawler = stats["brawlers"][i];
	// 	const eachField = {
	// 		name: `${brawler["name"]} [${brawler["power"]}] (${brawler["rank"]})`,
	// 		value: `${brawler["trophies"]} (*${brawler["highestTrophies"]}*) [${brawler["gadgets"]}-${brawler["starPowers"]}]`,
	// 		inline: true,
	// 	};
	// 	fieldsForBrawlers.push(eachField);
	// 	counter++;
	// 	if (counter == 24 || i == stats["brawlers"].length - 1) {
	// 		counter = 0;
	// 		const emb = client.embed({
	// 			title: `Brawlers of ${stats["name"]}`,
	// 			fields: fieldsForBrawlers,
	// 		});
	// 		fieldsForBrawlers = [];
	// 		embeds.push(emb);
	// 	}
	// }

	const statsEmbed = client.embed({
		title,
		description,
		fields,
		footer: {
			text: `Player Tag : ${stats["tag"]}`,
		},
	});

	await message.channel.send({ embed: statsEmbed });
	// for (let i = 0; i < embeds.length; i++)
	// 	await message.channel.send({ embed: embeds[i] });
};

export const name: string = "iplayer";
export const aliases: string[] = ["ip"];
export const description: string =
	"Gives the overall information about the player's so far gameplay.";
