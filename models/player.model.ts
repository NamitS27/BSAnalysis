import { model, Schema, Model, Document } from "mongoose";

interface playerModel extends Document {
	tag: string;
	name: string;
	trophies: number;
	highestTrophies: number;
	expLevel: number;
	expPoints: number;
	isQualifiedFromChampionshipChallenge: boolean;
	"3vs3Victories": number;
	soloVictories: number;
	duoVictories: number;
	brawlers: Array<brawler>;
	lastBattleTimestamp: string;
}

interface brawler {
	name: string;
	power: number;
	rank: number;
	trophies: number;
	highestTrophies: number;
	starPowers: number;
	gadgets: number;
}

const playerSchema = new Schema(
	{
		tag: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		trophies: { type: Number, default: 0 },
		highestTrophies: { type: Number, default: 0 },
		expLevel: { type: Number, default: 0 },
		expPoints: { type: Number, default: 0 },
		isQualifiedFromChampionshipChallenge: { type: Boolean, default: false },
		"3vs3Victories": { type: Number, default: 0 },
		soloVictories: { type: Number, default: 0 },
		duoVictories: { type: Number, default: 0 },
		brawlers: [
			{
				name: { type: String, required: true },
				power: { type: Number, default: 0 },
				rank: { type: Number, default: 0 },
				trophies: { type: Number, default: 0 },
				highestTrophies: { type: Number, default: 0 },
				starPowers: { type: Number, default: 0 },
				gadgets: { type: Number, default: 0 },
			},
		],
		lastBattleTimestamp: { type: String, default: "" },
	},
	{ versionKey: false }
);

export const Player: Model<playerModel> = model("Player", playerSchema);
