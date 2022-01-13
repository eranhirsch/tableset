import { Dict, Vec } from "common";
import { WingspanProductId } from "../steps/productsMetaStep";
import { Food } from "./Food";

const ALL_IDS = [
  "beakPointingLeft",
  "beakPointingRight",
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
  "birdsWorthUpTo3",
  "birdsWorth5orMore",
  "brownPowers",
  "cubesOnPlayBird",
  "eggsInBowl",
  "eggsInCavity",
  "eggsInForest",
  "eggsInGrassLands",
  "eggsInGround",
  "eggsInPlatform",
  "eggsInWetlands",
  "filledColumns",
  "foodCost",
  "foodCostFruitSeeds",
  "foodCostInvertebrate",
  "foodCostRodentsFish",
  "foodInSupply",
  "noGoal",
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
    ["birdsWorth5orMore", "birdsWithNoEggs"],
  ],
  oceania: [
    ["beakPointingLeft", "beakPointingRight"],
    ["noGoal", "foodCostRodentsFish"],
    ["foodCostInvertebrate", "foodCostFruitSeeds"],
    ["birdsWorthUpTo3", "cubesOnPlayBird"],
  ],
};

const ALL_ROW_IDS = ["forest", "grassland", "wetland"] as const;
type RowId = typeof ALL_ROW_IDS[number];
const ROW_LABELS: Readonly<Required<Record<RowId, string>>> = {
  forest: "Forest",
  grassland: "Grassland",
  wetland: "Wetland",
};

const ALL_NEST_TYPE_IDS = ["bowl", "cavity", "ground", "platform"] as const;
type NestTypeId = typeof ALL_NEST_TYPE_IDS[number];
const NEST_TYPE_LABELS: Readonly<Required<Record<NestTypeId, string>>> = {
  bowl: "Bowl",
  cavity: "Cavity",
  ground: "Ground",
  platform: "Platform",
};

const GOAL_NAMES: Readonly<Required<Record<GoalId, string>>> = {
  birdsInForest: `Birds in The ${ROW_LABELS.forest} Row`,
  birdsInGrasslands: `Birds in The ${ROW_LABELS.grassland} Row`,
  birdsInWetlands: `Birds in The ${ROW_LABELS.wetland} Row`,
  birdsWithEggsBowl: `${NEST_TYPE_LABELS.bowl} Nesting Birds with Eggs`,
  birdsWithEggsCavity: `${NEST_TYPE_LABELS.cavity} Nesting Birds with Eggs`,
  birdsWithEggsGround: `${NEST_TYPE_LABELS.ground} Nesting Birds with Eggs`,
  birdsWithEggsPlatform: `${NEST_TYPE_LABELS.platform} Nesting Birds with Eggs`,
  eggsInBowl: `Eggs in ${NEST_TYPE_LABELS.bowl} Nests`,
  eggsInCavity: `Eggs in ${NEST_TYPE_LABELS.cavity} Nests`,
  eggsInGround: `Eggs in ${NEST_TYPE_LABELS.ground} Nests`,
  eggsInPlatform: `Eggs in ${NEST_TYPE_LABELS.platform} Nests`,
  eggsInForest: `Eggs in The ${ROW_LABELS.forest} Row`,
  eggsInGrassLands: `Eggs in The ${ROW_LABELS.grassland} Row`,
  eggsInWetlands: `Eggs in The ${ROW_LABELS.wetland} Row`,
  totalBirds: "Total number of Birds",
  setsOfEggs: "Sets of Eggs in All Rows",

  foodInSupply: "Food in Supply",
  birdsInHand: "Bird Cards in Hand",
  birdsWorth5orMore: "Birds Worth Over 4 Points",
  birdsWithNoEggs: "Birds with No Eggs",
  birdsIn1Row: "Birds in 1 Row",
  filledColumns: "Filled Columns",
  brownPowers: "Brown Powers",
  whiteAndNoPowers: "White & No Powers",
  birdsWithTucked: "Birds with Tucked Cards",
  foodCost: "Food Cost for Played Birds",

  beakPointingLeft: "Beak Pointing Left",
  beakPointingRight: "Beak Pointing Right",
  noGoal: "No Goal",
  foodCostRodentsFish: `${Food.LABELS.rodent}+${Food.LABELS.fish} in Food Cost of Your Birds`,
  foodCostFruitSeeds: `${Food.LABELS.fruit}+${Food.LABELS.seed} in Food Cost of Your Birds`,
  foodCostInvertebrate: `${Food.LABELS.invertebrate} in Food Cost of Your Birds`,
  cubesOnPlayBird: "Cubes on Play a Bird",
  birdsWorthUpTo3: "Birds Worth Up to 3 Points",
};
const NUM_PER_GAME = 4;

export const Goals = {
  ALL_IDS,
  NUM_PER_GAME,
  labelFor: (goalId: GoalId) => GOAL_NAMES[goalId],
  availableForProducts: (productIds: readonly WingspanProductId[]) =>
    Vec.flatten(Vec.values(Dict.select_keys(TILES, productIds))),
} as const;
