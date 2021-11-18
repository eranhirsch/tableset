import { Vec } from "common";

const AIRSHIP_ABILITIES = [
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
  aggressive: Vec.range(0, 7),
  passive: Vec.range(8, AIRSHIP_ABILITIES.length - 1),
} as const;
