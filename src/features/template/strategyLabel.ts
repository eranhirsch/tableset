import { Strategy } from "./Strategy";

export function strategyLabel(strategy: Strategy): string {
  switch (strategy) {
    case Strategy.OFF:
      return "Disabled";
    case Strategy.RANDOM:
      return "Random";
    case Strategy.FIXED:
      return "Fixed";
  }
}
