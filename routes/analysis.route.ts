import express from "express";
import {
	insights,
	individualStats,
	brawlBrosStats,
	brawlBrosInsights,
} from "../controllers/map.analysis.controller";
const router = express.Router();

router.get("/insights", insights);
router.get("/stats/:person", individualStats);
router.get("/brawl/bro/insights", brawlBrosInsights);
router.get("/brawl/bro/stats", brawlBrosStats);

export const analysis = router;
