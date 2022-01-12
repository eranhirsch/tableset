import { Dict, Vec } from "common";
import { WingspanProductId } from "../steps/productsMetaStep";

const ALL_IDS = [
  "birdsIn1Row",
  "birdsInForest",
  "birdsInGrasslands",
  "birdsInHand",
  "birdsInWetlands",
  "birdsWithEggsBowl",
  "birdsWithEggsCavity",
  "birdsWithEggsGround",
  "birdsWithEggsPlatform",
  "birdsWithNoEggs",
  "birdsWithTucked",
  "birdsWorth4",
  "brownPowers",
  "eggsInBowl",
  "eggsInCavity",
  "eggsInForest",
  "eggsInGrassLands",
  "eggsInGround",
  "eggsInPlatform",
  "eggsInWetlands",
  "filledColumns",
  "foodCost",
  "foodInSupply",
  "setsOfEggs",
  "totalBirds",
  "whiteAndNoPowers",
] as const;
export type GoalId = typeof ALL_IDS[number];

const TILES: Readonly<
  Required<Record<WingspanProductId, readonly (readonly [GoalId, GoalId])[]>>
> = {
  base: [
    ["birdsInForest", "eggsInForest"],
    ["birdsInGrasslands", "eggsInGrassLands"],
    ["birdsInWetlands", "eggsInWetlands"],
    ["birdsWithEggsBowl", "eggsInBowl"],
    ["birdsWithEggsCavity", "eggsInCavity"],
    ["birdsWithEggsGround", "eggsInGround"],
    ["birdsWithEggsPlatform", "eggsInPlatform"],
    ["setsOfEggs", "totalBirds"],
  ],
  europe: [
    ["birdsIn1Row", "filledColumns"],
    ["brownPowers", "whiteAndNoPowers"],
    ["foodInSupply", "birdsInHand"],
    ["foodCost", "birdsWithTucked"],
    ["birdsWorth4", "birdsWithNoEggs"],
  ],
  oceania: [],
};

const GOAL_NAMES: Readonly<Required<Record<GoalId, string>>> = {
  birdsInForest: "Birds in The Forest Row",
  birdsInGrasslands: "Birds in The Grassland Row",
  birdsInWetlands: "Birds in The Wetland Row",
  birdsWithEggsBowl: "Bowl Nesting Birds with Eggs",
  birdsWithEggsCavity: "Cavity Nesting Birds with Eggs",
  birdsWithEggsGround: "Ground Nesting Birds with Eggs",
  birdsWithEggsPlatform: "Platform Nesting Birds with Eggs",
  eggsInBowl: "Eggs in Bowl Nests",
  eggsInCavity: "Eggs in Cavity Nests",
  eggsInGround: "Eggs in Ground Nests",
  eggsInPlatform: "Eggs in Platform Nests",
  eggsInForest: "Eggs in The Forest Row",
  eggsInGrassLands: "Eggs in The Grassland Row",
  eggsInWetlands: "Eggs in The Wetland Row",
  totalBirds: "Total number of Birds",
  setsOfEggs: "Sets of Eggs in All Rows",

  foodInSupply: "Food in Supply",
  birdsInHand: "Bird Cards in Hand",
  birdsWorth4: "Birds Worth Over 4 Points",
  birdsWithNoEggs: "Birds with No Eggs",
  birdsIn1Row: "Birds in 1 Row",
  filledColumns: "Filled Columns",
  brownPowers: "Brown Powers",
  whiteAndNoPowers: "White & No Powers",
  birdsWithTucked: "Birds with Tucked Cards",
  foodCost: "Food Cost for Played Birds",
};
const NUM_PER_GAME = 4;

export const Goals = {
  ALL_IDS,
  NUM_PER_GAME,
  labelFor: (goalId: GoalId) => GOAL_NAMES[goalId],
  availableForProducts: (productIds: readonly WingspanProductId[]) =>
    Vec.flatten(Vec.values(Dict.select_keys(TILES, productIds))),
} as const;
