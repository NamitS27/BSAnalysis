import { Player } from "../models/player.model";

export async function getPlayerInfo(person: string) {
	const tags = {
		namit: "#2LJYR2UU",
		devarsh: "#P0VYR22V",
		harvish: "#Y20PR9PC",
	};
	const player = await Player.findOne({ tag: tags[person] });
	return player;
}
