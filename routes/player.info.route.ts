import express from "express";
import { getPlayerInfo } from "../controllers/player.info.controller";
const router = express.Router();

router.get("/player-info/:tag", getPlayerInfo);

export const playerInfo = router;
