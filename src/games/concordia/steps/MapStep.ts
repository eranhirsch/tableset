import { Strategy } from "../../../core/Strategy";
import IGameStep, { InstanceContext, TemplateContext } from "../../IGameStep";
import ConcordiaGame from "../ConcordiaGame";

export default class MapStep implements IGameStep {
  public readonly id: string = "map";
  public readonly label: string = "Map";

  public resolveRandom(): string {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  public resolveDefault({ playersTotal }: InstanceContext): string {
    const recommendedMap: keyof typeof ConcordiaGame.MAPS =
      playersTotal < 4 ? "italia" : "imperium";
    return recommendedMap;
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
