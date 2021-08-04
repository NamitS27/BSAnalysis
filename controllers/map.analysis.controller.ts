import { Request, Response } from "express";
import {
	insights,
	brawlBrosInsights,
	individualStats,
	brawlBrosStats,
} from "../utils/mapAnalysis";

export async function insightsController(req: Request, res: Response) {
	let query = req.query;
	try {
		let insightsData = await insights(query);
		res.status(200).json(insightsData);
	} catch (err) {
		res.status(500).send(err);
	}
}

export async function individualStatsController(req: Request, res: Response) {
	try {
		const person: string = req.params.person;
		const statsData = await individualStats(person);
		res.status(200).json(statsData);
	} catch (err) {
		res.status(500).json(err);
	}
}

export async function brawlBrosInsightsController(req: Request, res: Response) {
	try {
		let query = req.query;
		let insightsData = await brawlBrosInsights(query);
		res.status(200).json(insightsData);
	} catch (err) {
		res.status(500).json(err);
	}
}

export async function brawlBrosStatsController(req: Request, res: Response) {
	try {
		let stats = await brawlBrosStats();
		res.status(200).json(stats);
	} catch (err) {
		res.status(500).json(err);
	}
}
