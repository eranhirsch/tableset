import { Dict, Vec } from "common";
import { GamePiecesColor } from "model/GamePiecesColor";
import { ScytheProductId } from "../ScytheProductId";
import { HexType } from "./HexType";

export type FactionId =
  /* spell-checker: disable */
  | "albion"
  | "crimea"
  | "fenris"
  | "nordic"
  | "polania"
  | "rusviet"
  | "saxony"
  | "tesla"
  | "togawa";
/* spell-checker: enable */

export interface Faction {
  name: string;
  abbreviated: string;
  color: GamePiecesColor;
  power: number;
  combatCards: number;
  order: number;
  startingWorkersLocations: [HexType, HexType];
}
const FACTIONS: Readonly<Record<FactionId, Readonly<Faction>>> = {
  /* spell-checker: disable */
  albion: {
    name: "Clan Albion",
    abbreviated: "Al",
    color: "green",
    power: 3,
    combatCards: 0,
    order: 6,
    startingWorkersLocations: ["mountain", "farm"],
  },
  crimea: {
    name: "Crimean Khanate",
    abbreviated: "Crim",
    color: "yellow",
    power: 5,
    combatCards: 0,
    order: 3,
    startingWorkersLocations: ["farm", "village"],
  },
  fenris: {
    name: "Fenris",
    abbreviated: "Fen",
    color: "orange",
    power: 4,
    combatCards: 2,
    // TODO: this is incorrect, fix this with the setup instructions for fenris and tesla
    order: 7,
    // This is obviously wrong and needs to be fixed when fenris is implemented
    startingWorkersLocations: ["factory", "factory"],
  },
  nordic: {
    name: "Nordic Kingdoms",
    abbreviated: "Nord",
    color: "blue",
    power: 4,
    combatCards: 1,
    order: 0,
    startingWorkersLocations: ["forest", "tundra"],
  },
  polania: {
    name: "Republic of Polania",
    abbreviated: "Pol",
    color: "white",
    power: 2,
    combatCards: 3,
    order: 5,
    startingWorkersLocations: ["forest", "farm"],
  },
  rusviet: {
    name: "Rusviet Union",
    abbreviated: "Rus",
    color: "red",
    power: 3,
    combatCards: 2,
    order: 1,
    startingWorkersLocations: ["village", "mountain"],
  },
  saxony: {
    name: "Saxony Empire",
    abbreviated: "Sax",
    color: "black",
    power: 1,
    combatCards: 4,
    order: 4,
    startingWorkersLocations: ["mountain", "tundra"],
  },
  tesla: {
    name: "Tesla",
    abbreviated: "Tes",
    color: "cyan",
    power: 1,
    combatCards: 1,
    // TODO: this is incorrect, fix this with the setup instructions for fenris and tesla
    order: 7,
    // TODO: this is obviously incorrect, fix this once we implement tesla
    startingWorkersLocations: ["factory", "factory"],
  },
  togawa: {
    name: "Togawa Shogunate",
    abbreviated: "Tog",
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
  availableForProducts: (products: readonly ScytheProductId[]) =>
    Vec.flatten(Vec.values(Dict.select_keys(FACTIONS_IN_PRODUCTS, products))),
} as const;
