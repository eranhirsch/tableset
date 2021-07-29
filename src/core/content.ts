import { Strategy } from "../features/template/templateSlice";

export function strategyLabel(strategy: Strategy): string {
  switch (strategy) {
    case Strategy.OFF:
      return "Off";
    case Strategy.DEFAULT:
      return "Default";
    case Strategy.RANDOM:
      return "Random";
    case Strategy.FIXED:
      return "Fixed";
    case Strategy.MANUAL:
      return "Manual";
  }
}
