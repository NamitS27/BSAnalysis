import dotenv from "dotenv";
import express from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cron from "node-cron";

// initialize configuration
dotenv.config();

const uri =
	"mongodb+srv://namit27:bsanalysis@bs-analysis.lvb01.mongodb.net/brawlanalysis?retryWrites=true&w=majority";
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
			console.log(err);
		} else {
			console.log("Connected to BS Analysis Database!");
		}
	}
);

const port = process.env.SERVER_PORT;
const app = express();

import { doTheNeedful } from "./controllers/analysis.controller";

cron.schedule("*/10 * * * *", doTheNeedful);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
	const currDate = new Date();
	console.log(
		`Application is running on port ${port} start @ ${currDate.toLocaleTimeString()}.`
	);
});

// import { battleLogRouter } from "./routes/analysis.route";
//
// app.use("/", battleLogRouter);
