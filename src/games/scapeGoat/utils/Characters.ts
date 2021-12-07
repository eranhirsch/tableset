import { Vec } from "common";
import { GamePiecesColor } from "model/GamePiecesColor";

const CHARACTERS = [
  // 3 Players
  "face",
  "pickpocket",
  "thief",
  // 4 Players
  "hacker",
  // 5 Players
  "muscle",
  // 6 Players
  "driver",
] as const;
export type CharacterId = typeof CHARACTERS[number];

export const Characters = {
  forPlayerCount: (playerCount: number): readonly CharacterId[] =>
    Vec.take(CHARACTERS, playerCount),
  label,
  color,
} as const;

function label(characterId: CharacterId): string {
  switch (characterId) {
    case "driver":
      return "Driver";
    case "face":
      return "Face";
    case "hacker":
      return "Hacker";
    case "muscle":
      return "Muscle";
    case "pickpocket":
      return "Pickpocket";
    case "thief":
      return "Thief";
  }
}

function color(characterId: CharacterId): GamePiecesColor {
  switch (characterId) {
    case "driver":
      return "purple";
    case "face":
      return "red";
    case "hacker":
      return "green";
    case "muscle":
      return "orange";
    case "pickpocket":
      return "yellow";
    case "thief":
      return "blue";
  }
}
