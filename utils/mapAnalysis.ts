import { Request, Response } from "express";
import { TeamBrawlerAnalysis, TeamAnalysis } from "../models/analysis.model";

export async function insights(query: any) {
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
	});

	return insights;
}

export async function individualStats(person: string) {
	const tags = {
		namit: "#2LJYR2UU",
		devarsh: "#P0VYR22V",
		harvish: "#Y20PR9PC",
	};

	const query = [
		{
			$facet: {
				modewise: [
					{
						$match: { tag: tags[person] },
					},
					{
						$group: {
							_id: "$mode",
							victory: { $sum: "$victory" },
							defeat: { $sum: "$defeat" },
							starPlayer: { $sum: "$starPlayer" },
						},
					},
				],
				overall: [
					{
						$match: { tag: tags[person] },
					},
					{
						$group: {
							_id: "$tag",
							victory: { $sum: "$victory" },
							defeat: { $sum: "$defeat" },
							starPlayer: { $sum: "$starPlayer" },
						},
					},
				],
			},
		},
	];

	const stats = await TeamBrawlerAnalysis.aggregate(query);
	return stats;
}

export async function brawlBrosInsights(query: any) {
	const insights = await TeamAnalysis.find(query).sort({
		victory: -1,
		meanDuration: 1,
		defeat: -1,
	});
	return insights;
}

export async function brawlBrosStats() {
	const query = [
		{
			$facet: {
				modewise: [
					{
						$group: {
							_id: "$mode",
							victory: { $sum: "$victory" },
							defeat: { $sum: "$defeat" },
						},
					},
				],
				overall: [
					{
						$group: {
							_id: null,
							victory: { $sum: "$victory" },
							defeat: { $sum: "$defeat" },
						},
					},
				],
			},
		},
	];
	const stats = await TeamAnalysis.aggregate(query);
	return stats;
}
