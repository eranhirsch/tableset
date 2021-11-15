import { Vec } from "common";

const AIRSHIP_ABILITIES = [
  // skip this, it's just here to make the array 1-based to match the cards
  "__ERROR",

  // Aggressive
  "Bombard",
  "Bounty",
  "Siege Engine",
  "Distract",
  "Espionage",
  "Blitzkrieg",
  "Toll",
  "War Correspondent",

  // Passive
  "Ferry",
  "Boost",
  "Drill",
  "Hero",
  "Safe Haven",
  "Reap",
  "Craft",
  "Negotiate",
] as const;

export const Airships = {
  tiles: AIRSHIP_ABILITIES,
  aggressive: Vec.range(1, 8),
  passive: Vec.range(9, 16),
} as const;
