import { Vec } from "common";
import { ScytheProductId } from "../ScytheProductId";

const CARDS = [
  // skip this, it's just here to make the array 1-based to match the cards
  "__ERROR",

  // 1
  "Higher Ground Advantage",
  "Underworld Advantage",
  "Harvest Advantage",
  "Northern Advantage",
  "King of the Hill",

  // 6
  "Send One Back as a Warning",
  "Machine Over Muscle",
  "Roll Up Your Sleeves with the Common Man",
  "Stockpile for the Winter",
  "Woodland Advantage",

  // 11
  "Population Advantage",
  "Get Rich or Cry Trying",
  "Foundations of the Empire",
  "Hedge Your Bets",
  "Balanced Workforce",

  // 16
  "A Wolf Among the Sheep",
  "Divide and Conquer",
  "Become a Beloved Pacifist",
  "Shore up the Shore",
  "Create a Permanent Foothold",

  // 21
  "Monopolize the Market",
  "Technological Breakthrough",
  "Achieve Tactical Mastery",
  "Establish a Human Shield",
  "Become a Despised Warmonger",

  // 26
  "Diversify Production",
  "Build Local Infrastructure",
] as const;

export const Objectives = {
  cards: CARDS,
  availableForProducts: (productIds: readonly ScytheProductId[]) =>
    Vec.concat(
      productIds.includes("base") ? Vec.range(1, 23) : [],
      productIds.includes("promo3") ? Vec.range(24, 27) : []
    ),
} as const;
