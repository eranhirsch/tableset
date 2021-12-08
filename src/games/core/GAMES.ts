import bloodRageGame from "games/bloodRage/bloodRageGame";
import { concordiaGame } from "games/concordia/concordiaGame";
import scapeGoatGame from "games/scapeGoat/scapeGoatGame";
import { scytheGame } from "games/scythe/scytheGame";
import { Game } from "model/Game";

export type GameId = "concordia" | "scythe" | "scapeGoat" | "bloodRage";

export const GAMES: Record<GameId, Readonly<Game>> = {
  bloodRage: bloodRageGame,
  concordia: concordiaGame,
  scapeGoat: scapeGoatGame,
  scythe: scytheGame,
};

export const isGameId = (x: unknown): x is GameId => GAMES[x as GameId] != null;