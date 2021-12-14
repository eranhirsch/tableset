import azulGame from "games/azul/azulGame";
import bloodRageGame from "games/bloodRage/bloodRageGame";
import { concordiaGame } from "games/concordia/concordiaGame";
import scapeGoatGame from "games/scapeGoat/scapeGoatGame";
import { scytheGame } from "games/scythe/scytheGame";
import terraformingMarsGame from "games/terraformingMars/terraformingMarsGame";
import wingspanGame from "games/wingspan/wingspanGame";
import { Game } from "model/Game";

export type GameId =
  | "azul"
  | "bloodRage"
  | "concordia"
  | "scapeGoat"
  | "scythe"
  | "terraformingMars"
  | "wingspan";

export const GAMES: Record<GameId, Readonly<Game>> = {
  azul: azulGame,
  bloodRage: bloodRageGame,
  concordia: concordiaGame,
  scapeGoat: scapeGoatGame,
  scythe: scytheGame,
  terraformingMars: terraformingMarsGame,
  wingspan: wingspanGame,
};

export const isGameId = (x: unknown): x is GameId => GAMES[x as GameId] != null;
