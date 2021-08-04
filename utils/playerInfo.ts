import { Player } from "../models/player.model";
import { Request, Response } from "express";

export async function getPlayerInfo(tag: string) {
	const player = await Player.findOne({ tag: tag });
	return player;
}
