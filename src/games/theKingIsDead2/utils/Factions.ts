import { ColorId } from "app/utils/Colors";
import { RegionId } from "./Regions";

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
