import { Player } from "../models/player.model";
import { Request, Response } from "express";

export async function getPlayerInfo(req: Request, res: Response) {
	try {
		const tag: string = `#${req.params.tag}`;
		const player = await Player.findOne({ tag: tag });
		if (player) {
			res.status(200).json(player);
		} else {
			res.status(404).send("Player not found");
		}
	} catch (err) {
		res.status(500).send(err);
	}
}
