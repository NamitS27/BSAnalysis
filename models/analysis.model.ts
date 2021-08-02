import { model, Schema, Model, Document } from "mongoose";

interface teamBrawlerAnalysisModel extends Document {
	tag: string;
	mode: string;
	map: string;
	brawlerName: string;
	victory: number;
	defeat: number;
	trophyChange: number;
	meanDuration: number;
	starPlayer: number;
}

interface teamAnalysisModel extends Document {
	mode: string;
	map: string;
	victory: number;
	defeat: number;
	meanDuration: number;
	team: [string];
}

const teamBrawlerAnalysisSchema = new Schema(
	{
		tag: { type: String, required: true },
		mode: { type: String, required: true },
		map: { type: String, required: true },
		brawlerName: { type: String, required: true },
		victory: { type: Number, required: true, default: 0 },
		defeat: { type: Number, required: true, default: 0 },
		trophyChange: { type: Number, required: true },
		meanDuration: { type: Number, required: true, default: 0 },
		starPlayer: { type: Number, required: true, default: 0 },
	},
	{ versionKey: false }
);

const teamAnalysisSchema = new Schema(
	{
		mode: { type: String, required: true },
		map: { type: String, required: true },
		victory: { type: Number, required: true, default: 0 },
		defeat: { type: Number, required: true, default: 0 },
		meanDuration: { type: Number, required: true, default: 0 },
		team: { type: [String], required: true },
	},
	{ versionKey: false }
);

export const TeamBrawlerAnalysis: Model<teamBrawlerAnalysisModel> = model(
	"Team-Brawler-Analysis",
	teamBrawlerAnalysisSchema
);

export const TeamAnalysis: Model<teamAnalysisModel> = model(
	"Team-Analysis",
	teamAnalysisSchema
);
