const ALL_IDS = [
  "fish",
  "fruit",
  "invertebrate",
  "nectar",
  "rodent",
  "seed",
] as const;
export type FoodTypeId = typeof ALL_IDS[number];

const LABELS: Readonly<Required<Record<FoodTypeId, string>>> = {
  fish: "Fish",
  fruit: "Fruit",
  invertebrate: "Invertebrate",
  rodent: "Rodent",
  seed: "Seed",
  nectar: "Nectar",
};

export const Food = {
  ALL_IDS,
  LABELS,
} as const;
