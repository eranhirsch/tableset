import { concordiaGame } from "games/concordia/concordiaGame";
import { Game } from "model/Game";

export type GameId = "concordia";

export const GAMES: Required<Record<GameId, Readonly<Game>>> = {
  concordia: concordiaGame,
};
