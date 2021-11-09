import { concordiaGame } from "games/concordia/concordiaGame";
import { scytheGame } from "games/scythe/scytheGame";
import { Game } from "model/Game";

export type GameId = "concordia" | "scythe";

export const GAMES: Record<GameId, Readonly<Game>> = {
  concordia: concordiaGame,
  scythe: scytheGame,
};
