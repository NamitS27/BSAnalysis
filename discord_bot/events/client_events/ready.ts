import { Run } from "../../interfaces/event";

export const run: Run = async (client) => {
	client.logger.success(`${client.user.tag} is online!`);
};

export const name: string = "ready";
