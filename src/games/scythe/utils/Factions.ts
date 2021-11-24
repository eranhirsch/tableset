import { Dict, Vec } from "common";
import { GamePiecesColor } from "model/GamePiecesColor";
import { ScytheProductId } from "../ScytheProductId";
import { HexType } from "./HexType";

const ALL_FACTION_IDS = [
  /* spell-checker: disable */
  "albion",
  "crimea",
  "fenris",
  "nordic",
  "polania",
  "rusviet",
  "saxony",
  "tesla",
  "togawa",
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
  color: GamePiecesColor;
  power: number;
  combatCards: number;
  order: number;
  startingWorkersLocations: [HexType, HexType];
}

const FACTIONS: Readonly<Record<FactionId, Readonly<Faction>>> = {
  /* spell-checker: disable */
  albion: {
    name: { abbreviated: "Al", short: "Albion", full: "Clan Albion" },
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
    // TODO: this is incorrect, fix this with the setup instructions for fenris and tesla
    order: 7,
    // This is obviously wrong and needs to be fixed when fenris is implemented
    startingWorkersLocations: ["factory", "factory"],
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
  tesla: {
    name: { abbreviated: "Tes", short: "Tesla", full: "Tesla" },
    color: "cyan",
    power: 1,
    combatCards: 1,
    // TODO: this is incorrect, fix this with the setup instructions for fenris and tesla
    order: 7,
    // TODO: this is obviously incorrect, fix this once we implement tesla
    startingWorkersLocations: ["factory", "factory"],
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
  fenris: ["fenris", "tesla"],
};

export const Factions = {
  ...FACTIONS,
  ALL_IDS: ALL_FACTION_IDS,
  availableForProducts: (products: readonly ScytheProductId[]) =>
    Vec.flatten(Vec.values(Dict.select_keys(FACTIONS_IN_PRODUCTS, products))),
} as const;
