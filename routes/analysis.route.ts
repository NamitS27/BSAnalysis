import express from "express";
import { insights } from "../controllers/map.analysis.controller";
const router = express.Router();

router.get("/insights", insights);

export const analysis = router;
