export type HexType =
  | "farm"
  | "lake"
  | "tundra"
  | "forest"
  | "mountain"
  | "village"
  | "factory";

export const HEX_TYPE_LABEL: Readonly<Record<HexType, string>> = {
  farm: "Farm",
  lake: "Lake",
  tundra: "Tundra",
  forest: "Forest",
  mountain: "Mountain",
  village: "Village",
  factory: "Factory",
};
