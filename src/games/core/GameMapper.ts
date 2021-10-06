import { concordiaGame } from "games/concordia/ConcordiaGame";
import { Game } from "model/Game";

export type GameId = "concordia";

export const gameMapper = Object.freeze({
  concordia: concordiaGame,
} as Record<GameId, Game>);
