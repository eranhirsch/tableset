import { Game } from "features/instance/Game";
import azulGame from "games/azul/azulGame";
import bloodRageGame from "games/bloodRage/bloodRageGame";
import { concordiaGame } from "games/concordia/concordiaGame";
import scapeGoatGame from "games/scapeGoat/scapeGoatGame";
import { scytheGame } from "games/scythe/scytheGame";
import terraformingMarsGame from "games/terraformingMars/terraformingMarsGame";
import theKingIsDead2Game from "games/theKingIsDead2/theKingIsDead2Game";
import wingspanGame from "games/wingspan/wingspanGame";

export type GameId =
  | "azul"
  | "bloodRage"
  | "concordia"
  | "scapeGoat"
  | "scythe"
  | "terraformingMars"
  | "theKingIsDead2"
  | "wingspan";

export const GAMES: Record<GameId, Readonly<Game>> = {
  azul: azulGame,
  bloodRage: bloodRageGame,
  concordia: concordiaGame,
  scapeGoat: scapeGoatGame,
  scythe: scytheGame,
  terraformingMars: terraformingMarsGame,
  theKingIsDead2: theKingIsDead2Game,
  wingspan: wingspanGame,
};

export const isGameId = (x: unknown): x is GameId => GAMES[x as GameId] != null;
