import dotenv from "dotenv";
import express from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cron from "node-cron";
import { Bot } from "./discord_bot/client/client";
import { logger } from "./logger";

// initialize configuration
dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(
	uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	(err) => {
		if (err) {
			logger.error(err);
		} else {
			logger.success("Connected to BS Analysis Database!");
		}
	}
);

const port = process.env.SERVER_PORT;
const app = express();

import { doTheNeedful } from "./utils/analysis";

cron.schedule("*/10 * * * *", doTheNeedful);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
	logger.info(`Application is running on port ${port}.`);
});

new Bot().start();

import { playerInfo } from "./routes/player.info.route";
import { analysis } from "./routes/analysis.route";

app.use("/bsanalysis/api/v1/", playerInfo);
app.use("/bsanalysis/api/v1/", analysis);
