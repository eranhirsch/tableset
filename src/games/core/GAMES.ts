import bloodRageGame from "games/bloodRage/bloodRageGame";
import { concordiaGame } from "games/concordia/concordiaGame";
import scapeGoatGame from "games/scapeGoat/scapeGoatGame";
import { scytheGame } from "games/scythe/scytheGame";
import wingspanGame from "games/wingspan/wingspanGame";
import { Game } from "model/Game";

export type GameId =
  | "bloodRage"
  | "concordia"
  | "scapeGoat"
  | "scythe"
  | "wingspan";

export const GAMES: Record<GameId, Readonly<Game>> = {
  bloodRage: bloodRageGame,
  concordia: concordiaGame,
  scapeGoat: scapeGoatGame,
  scythe: scytheGame,
  wingspan: wingspanGame,
};

export const isGameId = (x: unknown): x is GameId => GAMES[x as GameId] != null;