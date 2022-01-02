import { ColorId } from "app/utils/Colors";
import { $, Vec } from "common";
import { RegionId } from "./Regions";

// 18 initial minus 2 per each home region
const NUM_FOLLOWERS = 16;
export const NUM_FOLLOWERS_REMOVED_2P = 2;

export const ALL_FACTION_IDS = ["english", "scottish", "welsh"] as const;
export type FactionId = typeof ALL_FACTION_IDS[number];

interface Faction {
  name: string;
  color: ColorId;
  homeRegion: RegionId;
}
export const Factions: Readonly<Required<Record<FactionId, Faction>>> = {
  english: { name: "English", color: "yellow", homeRegion: "essex" },
  scottish: { name: "Scottish", color: "blue", homeRegion: "moray" },
  welsh: { name: "Welsh", color: "red", homeRegion: "gwynedd" },
};

export function allFactionCubes(playerCount: number): readonly FactionId[] {
  return $(
    // The number of cubes we have per faction
    NUM_FOLLOWERS - (playerCount === 2 ? NUM_FOLLOWERS_REMOVED_2P : 0),
    // Create the "bag"
    ($$) => Vec.map(ALL_FACTION_IDS, (factionId) => Vec.fill($$, factionId)),
    Vec.flatten
  );
}