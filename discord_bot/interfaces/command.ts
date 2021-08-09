import { Bot } from "../client/client";

import { Message } from "discord.js";

export interface Run {
	(client: Bot, message: Message, args: string[]): Promise<void>;
}

export interface Command {
	name: string;
	description?: string;
	aliases?: string[];
	usage: string;
	run: Run;
}
