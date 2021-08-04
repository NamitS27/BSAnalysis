import { Message } from "discord.js";
import { Run } from "../interfaces/command";

export const run: Run = async (client, message) => {
	const msg: Message = await message.channel.send("Calculating...");
};

export const name: string = "stats";
export const aliases: string[] = ["statsn"];
