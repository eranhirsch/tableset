import { ColorId } from "app/utils/Colors";
import { Dict, Vec } from "common";
import { ScytheProductId } from "../ScytheProductId";
import { HexType } from "./HexType";

/**
 * All faction IDs in the game.
 * IMPORTANT: DO NOT SORT, We use the order in the `HomeBases` module to make
 * sure our numbers are consistent.
 */
const ALL_FACTION_IDS = [
  /* spell-checker: disable */
  // Base
  "crimea",
  "nordic",
  "polania",
  "rusviet",
  "saxony",

  // invaders
  "albion",
  "togawa",

  // fenris
  "fenris",
  "vesna",
  /* spell-checker: enable */
] as const;
export type FactionId = typeof ALL_FACTION_IDS[number];

interface FactionName {
  abbreviated: string;
  short: string;
  full: string;
}

export interface Faction {
  name: FactionName;
  color: ColorId;
  power: number;
  combatCards: number;
  order?: number;
  startingWorkersLocations?: [HexType, HexType];
}

const FACTIONS: Readonly<Record<FactionId, Readonly<Faction>>> = {
  /* spell-checker: disable */
  albion: {
    name: { abbreviated: "Alb", short: "Albion", full: "Clan Albion" },
    color: "green",
    power: 3,
    combatCards: 0,
    order: 6,
    startingWorkersLocations: ["mountain", "farm"],
  },
  crimea: {
    name: { abbreviated: "Crim", short: "Crimea", full: "Crimean Khanate" },
    color: "yellow",
    power: 5,
    combatCards: 0,
    order: 3,
    startingWorkersLocations: ["farm", "village"],
  },
  fenris: {
    name: { abbreviated: "Fen", short: "Fenris", full: "Fenris" },
    color: "orange",
    power: 4,
    combatCards: 2,
  },
  nordic: {
    name: { abbreviated: "Nord", short: "Nordic", full: "Nordic Kingdoms" },
    color: "blue",
    power: 4,
    combatCards: 1,
    order: 0,
    startingWorkersLocations: ["forest", "tundra"],
  },
  polania: {
    name: { abbreviated: "Pol", short: "Polania", full: "Republic of Polania" },
    color: "white",
    power: 2,
    combatCards: 3,
    order: 5,
    startingWorkersLocations: ["forest", "farm"],
  },
  rusviet: {
    name: { abbreviated: "Rus", short: "Rusviet", full: "Rusviet Union" },
    color: "red",
    power: 3,
    combatCards: 2,
    order: 1,
    startingWorkersLocations: ["village", "mountain"],
  },
  saxony: {
    name: { abbreviated: "Sax", short: "Saxony", full: "Saxony Empire" },
    color: "black",
    power: 1,
    combatCards: 4,
    order: 4,
    startingWorkersLocations: ["mountain", "tundra"],
  },
  vesna: {
    name: { abbreviated: "Ves", short: "Vesna", full: "Vesna" },
    color: "cyan",
    power: 1,
    combatCards: 1,
  },
  togawa: {
    name: { abbreviated: "Tog", short: "Togawa", full: "Togawa Shogunate" },
    color: "purple",
    power: 0,
    combatCards: 2,
    order: 2,
    startingWorkersLocations: ["tundra", "farm"],
  },
  /* spell-checker: enable */
};

const FACTIONS_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly FactionId[]>>
> = {
  base: ["crimea", "nordic", "polania", "rusviet", "saxony"],
  invaders: ["albion", "togawa"],
  fenris: ["fenris", "vesna"],
};

export const Factions = {
  ...FACTIONS,
  ALL_IDS: ALL_FACTION_IDS,
  availableForProducts: (products: readonly ScytheProductId[]) =>
    Vec.flatten(Vec.values(Dict.select_keys(FACTIONS_IN_PRODUCTS, products))),
} as const;
