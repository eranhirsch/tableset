export type Resource = "salt" | "bricks" | "food" | "tools" | "wine" | "cloth";

export const RESOURCE_COST: Readonly<Record<Resource, number>> = {
  salt: 0,
  bricks: 3,
  food: 4,
  tools: 5,
  wine: 6,
  cloth: 7,
};

export const RESOURCE_NAME: Record<Resource, string> = {
  salt: "Salt",
  bricks: "Bricks",
  food: "Food",
  tools: "Tools",
  wine: "Wine",
  cloth: "Cloth",
};

export const isResource = (x: string): x is Resource => x in RESOURCE_COST;
