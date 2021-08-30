import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";
import ConcordiaGame from "../ConcordiaGame";

export default class MapStep implements IGameStep {
  public readonly id: string = "map";
  public readonly label: string = "Map";

  public resolveRandom(): string {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  public get items(): string[] {
    return Object.keys(ConcordiaGame.MAPS);
  }

  public labelForItem(value: string): string {
    return ConcordiaGame.MAPS[value as keyof typeof ConcordiaGame.MAPS].name;
  }

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    const strategies = [
      Strategy.OFF,
      Strategy.RANDOM,
      Strategy.ASK,
      Strategy.FIXED,
    ];
    if (playersTotal >= 2 && playersTotal <= 5) {
      strategies.push(Strategy.DEFAULT);
    }
    return strategies;
  }
}
