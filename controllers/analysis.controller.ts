import fetch from "node-fetch";
import { Player } from "../models/player.model";
import { TeamAnalysis, TeamBrawlerAnalysis } from "../models/analysis.model";
import { logger } from "../logger";

export async function doTheNeedful() {
	try {
		const tags: string[] = ["#2LJYR2UU", "#P0VYR22V", "#Y20PR9PC"];

		for (let i = 0; i < tags.length; i++) {
			let tag = tags[i];
			const playerInfo = await getPlayerInfo(tag);
			const battleLog = await getBattleLog(tag);
			const currPlayer = await Player.findOne({ tag: tag });

			const prevBattleTimestamp: string = currPlayer.lastBattleTimestamp;

			await battleLogAnalysis(battleLog, tag, prevBattleTimestamp);
			const lastBattleTimestamp = battleLog["items"][0]["battleTime"];
			const {
				name,
				trophies,
				highestTrophies,
				expLevel,
				expPoints,
				isQualifiedFromChampionshipChallenge,
				soloVictories,
				duoVictories,
				brawlers,
			} = playerInfo;

			const playerBrawlers = brawlers.map((brawler) => {
				return {
					name: brawler.name,
					power: brawler.power,
					rank: brawler.rank,
					trophies: brawler.trophies,
					highestTrophies: brawler.highestTrophies,
					starPowers: brawler.starPowers.length,
					gadgets: brawler.gadgets.length,
				};
			});
			const details = {
				tag: tag,
				name: name,
				trophies: trophies,
				highestTrophies: highestTrophies,
				expLevel: expLevel,
				expPoints: expPoints,
				isQualifiedFromChampionshipChallenge:
					isQualifiedFromChampionshipChallenge,
				soloVictories: soloVictories,
				duoVictories: duoVictories,
				"3vs3Victories": playerInfo["3vs3Victories"] || 0,
				brawlers: playerBrawlers,
				lastBattleTimestamp: lastBattleTimestamp,
			};
			await Player.findOneAndUpdate({ tag: tag }, details);
		}

		logger.success("Success");
	} catch (err) {
		logger.error(err.message);
	}
}

async function getPlayerInfo(tag: string): Promise<any> {
	try {
		let response = await fetch(
			`https://api.brawlstars.com/v1/players/%23${tag.substring(1)}`,
			{
				method: "GET",
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${process.env.API_TOKEN}`,
				},
			}
		);
		let data = await response.json();
		return data;
	} catch (err) {
		throw err;
	}
}

async function getBattleLog(tag: string): Promise<any> {
	try {
		let response = await fetch(
			`https://api.brawlstars.com/v1/players/%23${tag.substring(
				1
			)}/battlelog`,
			{
				method: "GET",
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${process.env.API_TOKEN}`,
				},
			}
		);
		let data = await response.json();
		return data;
	} catch (err) {
		throw err;
	}
}

async function battleLogAnalysis(
	battleLog: Promise<any>,
	tag: string,
	prevBattleTime: string
) {
	try {
		const battleLogs: any[] = battleLog["items"];

		for (let i = 0; i < battleLogs.length; i++) {
			let battle = battleLogs[i];

			if (battle["battleTime"] == prevBattleTime) break;
			const event = battle["event"];
			const battleDetails = battle["battle"];
			const eventMap = event["map"];
			const eventMode = battleDetails["mode"];
			const trophyChange = battleDetails["trophyChange"] || 0;
			const result = battleDetails["result"];
			const duration = battleDetails["duration"] || 0;
			const starPlayer = battleDetails["starPlayer"];

			if (battleDetails["teams"]) {
				if (battleDetails["teams"].length === 2) {
					const team1 = battleDetails["teams"][0];
					const team2 = battleDetails["teams"][1];

					const parsedTeams = parseTeams(team1, team2, tag);
					let starPlayerTag: string = "";
					if (starPlayer) starPlayerTag = starPlayer["tag"];

					await updateTeamBrawlerAnalysis(
						tag,
						eventMap,
						eventMode,
						parsedTeams["brawler"],
						duration,
						result,
						trophyChange,
						starPlayerTag
					);
					if (parsedTeams["trio"] == "Yes" && tag == "#2LJYR2UU") {
						await updateTeamAnalysis(
							eventMap,
							eventMode,
							parsedTeams["finalTeam"],
							duration,
							result
						);
					}
				}
			}
		}
	} catch (err) {
		console.log(err.message);
	}
}

function parseTeams(team1: any, team2: any, tag: string): teamParse {
	let predefTagArray = ["#2LJYR2UU", "#P0VYR22V", "#Y20PR9PC"];

	let teamTags = team1.map((player) => player["tag"]);
	let teamTags2 = team2.map((player) => player["tag"]);

	let team, myBrawler;

	team1.forEach((player) => {
		if (player["tag"] === tag) {
			myBrawler = player["brawler"];
			team = team1;
		}
	});
	team2.forEach((player) => {
		if (player["tag"] === tag) {
			myBrawler = player["brawler"];
			team = team2;
		}
	});

	myBrawler = myBrawler.name;
	team = team.map((player) => player.brawler.name);
	team = team.sort();

	teamTags = teamTags.sort();
	teamTags2 = teamTags2.sort();

	if (
		JSON.stringify(predefTagArray) == JSON.stringify(teamTags) ||
		JSON.stringify(predefTagArray) == JSON.stringify(teamTags2)
	) {
		return {
			trio: "Yes",
			finalTeam: team,
			brawler: myBrawler,
		};
	}
	return {
		trio: "No",
		finalTeam: team,
		brawler: myBrawler,
	};
}

async function updateTeamAnalysis(
	map: any,
	mode: any,
	team: [string],
	duration: number,
	result: string
) {
	try {
		const currTeamAnalysis = await TeamAnalysis.findOne({
			map: map,
			mode: mode,
			team: team,
		});
		if (currTeamAnalysis) {
			currTeamAnalysis.meanDuration =
				(currTeamAnalysis.meanDuration + duration) / 2;
			if (result == "defeat") {
				currTeamAnalysis.defeat += 1;
			} else {
				currTeamAnalysis.victory += 1;
			}
			await currTeamAnalysis.save();
		} else {
			if (map == null) map = "mapMaker";
			let vic: number = 0,
				def: number = 0;
			if (result == "defeat") def++;
			else vic++;
			const newData = new TeamAnalysis({
				map: map,
				mode: mode,
				team: team,
				meanDuration: duration,
				victory: vic,
				defeat: def,
			});
			await newData.save();
		}
	} catch (err) {
		console.log(err.message);
	}
}

async function updateTeamBrawlerAnalysis(
	tag,
	map: any,
	mode: any,
	brawlerName: string,
	duration: number,
	result: string,
	trophyChange: number,
	starPlayerTag: string
) {
	const currTeamBrawlerAnalysis = await TeamBrawlerAnalysis.findOne({
		tag: tag,
		map: map,
		mode: mode,
		brawlerName: brawlerName,
	});

	if (currTeamBrawlerAnalysis) {
		currTeamBrawlerAnalysis.meanDuration =
			(currTeamBrawlerAnalysis.meanDuration + duration) / 2;
		if (result == "defeat") {
			currTeamBrawlerAnalysis.defeat += 1;
		} else {
			currTeamBrawlerAnalysis.victory += 1;
		}
		currTeamBrawlerAnalysis.trophyChange =
			(currTeamBrawlerAnalysis.trophyChange + trophyChange) / 2;
		currTeamBrawlerAnalysis.starPlayer += starPlayerTag === tag ? 1 : 0;
		await currTeamBrawlerAnalysis.save();
	} else {
		if (map == null) map = "mapMaker";
		let vic: number = 0,
			def: number = 0;
		if (result == "defeat") def++;
		else vic++;
		const newData = new TeamBrawlerAnalysis({
			tag: tag,
			map: map,
			mode: mode,
			brawlerName: brawlerName,
			meanDuration: duration,
			victory: vic,
			defeat: def,
			trophyChange: trophyChange,
			starPlayer: starPlayerTag === tag ? 1 : 0,
		});
		await newData.save();
	}
}

interface teamParse {
	trio: string;
	finalTeam: [string];
	brawler: string;
}
