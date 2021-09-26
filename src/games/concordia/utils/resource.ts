export type Resource = "bricks" | "food" | "tools" | "wine" | "cloth";

export const RESOURCE_COST: Readonly<Record<Resource, number>> = Object.freeze({
  bricks: 3,
  food: 4,
  tools: 5,
  wine: 6,
  cloth: 7,
});

export function resourceName(resource: Resource): string {
  switch (resource) {
    case "bricks":
      return "Bricks";
    case "food":
      return "Food";
    case "tools":
      return "Tools";
    case "wine":
      return "Wine";
    case "cloth":
      return "Cloth";
  }
}
