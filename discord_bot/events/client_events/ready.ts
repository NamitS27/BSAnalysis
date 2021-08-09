import { Run } from "../../interfaces/event";

export const run: Run = async (client) => {
	client.logger.success(`${client.user.tag} is online!`);
	client.user.setActivity({ type: "LISTENING", name: "?help" });
};

export const name: string = "ready";
