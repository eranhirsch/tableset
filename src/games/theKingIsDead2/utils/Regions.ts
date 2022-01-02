export const ALL_REGION_IDS = [
  // Sorted by location on the map
  "moray",
  "strathclyde",
  "lancaster",
  "northumbria",
  "gwynedd",
  "warwick",
  "devon",
  "essex",
] as const;

export type RegionId = typeof ALL_REGION_IDS[number];

export const REGION_NAME: Readonly<Required<Record<RegionId, string>>> = {
  devon: "Devon",
  essex: "Essex",
  gwynedd: "Gwynedd",
  lancaster: "Lancaster",
  moray: "Moray",
  northumbria: "Northumbria",
  strathclyde: "Strathclyde",
  warwick: "Warwick",
};
