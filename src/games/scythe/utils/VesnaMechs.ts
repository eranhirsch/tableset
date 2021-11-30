import { Vec } from "common";

export const VESNA_MECH_ABILITIES = {
  /* spell-checker: disable */
  artillery: "Artillery",
  camaraderie: "Camaraderie",
  disarm: "Disarm",
  feint: "Feint",
  peoplesArmy: "People's Army",
  regroup: "Regroup",
  ronin: "Ronin",
  scout: "Scout",
  seaworthy: "Seaworthy",
  shield: "Shield",
  stealth: "Stealth",
  submerge: "Submerge",
  suiton: "Suiton",
  sword: "Sword",
  tactics: "Tactics",
  township: "Township",
  underpass: "Underpass",
  wayfare: "Wayfare",
  /* spell-checker: enable */
} as const;
export type VesnaMechId = keyof typeof VESNA_MECH_ABILITIES;
export const ALL_VESNA_MECH_IDS: readonly VesnaMechId[] =
  Vec.keys(VESNA_MECH_ABILITIES);
