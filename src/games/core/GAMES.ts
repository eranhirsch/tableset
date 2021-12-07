import { concordiaGame } from "games/concordia/concordiaGame";
import scapeGoatGame from "games/scapeGoat/scapeGoatGame";
import { scytheGame } from "games/scythe/scytheGame";
import { Game } from "model/Game";

export type GameId = "concordia" | "scythe" | "scapeGoat";

export const GAMES: Record<GameId, Readonly<Game>> = {
  concordia: concordiaGame,
  scythe: scytheGame,
  scapeGoat: scapeGoatGame,
};

export const isGameId = (x: unknown): x is GameId => GAMES[x as GameId] != null;