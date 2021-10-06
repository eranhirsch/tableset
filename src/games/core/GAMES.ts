import { concordiaGame } from "games/concordia/concordiaGame";
import { Game } from "model/Game";

export type GameId = "concordia";

export const GAMES = Object.freeze({
  concordia: concordiaGame,
} as Record<GameId, Game>);
