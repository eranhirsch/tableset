import { GamePiecesColor } from "model/GamePiecesColor";

const ALL_CLAN_IDS = ["bear", "raven", "serpent", "wolf"] as const;
export type ClanId = typeof ALL_CLAN_IDS[number];

export const Clans = {
  ids: ALL_CLAN_IDS,
  isClanId: (x: unknown): x is ClanId => ALL_CLAN_IDS.includes(x as ClanId),
  color,
  label,
} as const;

function color(clanId: ClanId): GamePiecesColor {
  switch (clanId) {
    case "bear":
      return "brown";
    case "raven":
      return "blue";
    case "serpent":
      return "orange";
    case "wolf":
      return "red";
  }
}

function label(clanId: ClanId): string {
  switch (clanId) {
    case "bear":
      return "Bear";
    case "raven":
      return "Raven";
    case "serpent":
      return "Serpent";
    case "wolf":
      return "Wolf";
  }
}
