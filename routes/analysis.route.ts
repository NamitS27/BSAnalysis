import express from "express";
import {
	insightsController,
	individualStatsController,
	brawlBrosStatsController,
	brawlBrosInsightsController,
} from "../controllers/map.analysis.controller";
const router = express.Router();

router.get("/insights", insightsController);
router.get("/stats/:person", individualStatsController);
router.get("/brawl/bro/insights", brawlBrosInsightsController);
router.get("/brawl/bro/stats", brawlBrosStatsController);

export const analysis = router;
