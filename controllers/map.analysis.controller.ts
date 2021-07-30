import { Request, Response } from "express";
import { TeamBrawlerAnalysis, TeamAnalysis } from "../models/analysis.model";

export async function insights(req: Request, res: Response) {
	let query = req.query;
	const tags = {
		namit: "#2LJYR2UU",
		devarsh: "#P0VYR22V",
		harvish: "#Y20PR9PC",
	};
	if (query.tag) {
		const key: string = query.tag as string;
		query.tag = tags[key];
	}
	const insights = await TeamBrawlerAnalysis.find(query).sort({
		victory: -1,
		starPlayer: -1,
		defeat: -1,
		trophyChange: -1,
		meanDuration: 1,
	});

	res.status(200).json(insights);
}

export async function individualStats(req: Request, res: Response) {
	try {
		const person: string = req.params.person;
		const tags = {
			namit: "#2LJYR2UU",
			devarsh: "#P0VYR22V",
			harvish: "#Y20PR9PC",
		};

		const query = [
			{
				$match: {
					tag: tags[person],
				},
			},
			{
				$group: {
					_id: "$mode",
					victory: { $sum: "$victory" },
					defeat: { $sum: "$defeat" },
					trophyChange: { $sum: "$trophyChange" },
					meanDuration: { $avg: "$meanDuration" },
					starPlayer: { $sum: "$starPlayer" },
				},
			},
			{
				$group: {
					_id: "$tag",
					victory: { $sum: "$victory" },
					defeat: { $sum: "$defeat" },
					trophyChange: { $sum: "$trophyChange" },
					starPlayer: { $sum: "$starPlayer" },
				},
			},
		];
		const stats = await TeamBrawlerAnalysis.aggregate(query);
		res.status(200).json(stats);
	} catch (err) {
		res.status(500).json(err);
	}
}

export async function brawlBrosInsights(req: Request, res: Response) {
	try {
		let query = req.query;
		const insights = await TeamAnalysis.find(query).sort({
			victory: -1,
			meanDuration: 1,
			defeat: -1,
		});
		res.status(200).json(insights);
	} catch (err) {
		res.status(500).json(err);
	}
}

export async function brawlBrosStats(req: Request, res: Response) {
	try {
		const query = [
			{
				$group: {
					_id: "$mode",
					victory: { $sum: "$victory" },
					defeat: { $sum: "$defeat" },
					meanDuration: { $avg: "$meanDuration" },
				},
			},
		];
		const stats = await TeamAnalysis.aggregate(query);
		res.status(200).json(stats);
	} catch (err) {
		res.status(500).json(err);
	}
}
