export type Resource = "bricks" | "food" | "tools" | "wine" | "cloth";

export const RESOURCE_COST = Object.freeze({
  bricks: 3,
  food: 4,
  tools: 5,
  wine: 6,
  cloth: 7,
} as Record<Resource, number>);

export const RESOURCE_NAME = Object.freeze({
  bricks: "Bricks",
  food: "Food",
  tools: "Tools",
  wine: "Wine",
  cloth: "Cloth",
} as Record<Resource, string>);

export const isResource = (x: string): x is Resource => x in RESOURCE_COST;
