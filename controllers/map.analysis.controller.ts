import { Request, Response } from "express";
import { TeamBrawlerAnalysis } from "../models/analysis.model";

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
