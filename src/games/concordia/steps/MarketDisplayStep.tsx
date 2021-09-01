import Base32 from "../../../common/Base32";
import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { Strategy } from "../../../core/Strategy";
import IGameStep from "../../core/steps/IGameStep";
import { MarketDisplayFixedInstructions } from "../ux/MarketDisplayFixedInstructions";

const MARKET_DECK_PHASE_1: readonly string[] = [
  "Architect",
  "Prefect",
  "Mercator",
  "Colonist",
  "Diplomat",
  "Mason",
  "Farmer",
  "Smith",
];

export default class MarketDisplayStep implements IGameStep<string> {
  public readonly id: string = "marketDisplay";
  public readonly label: string = "Cards Display";

  public static fromHash(hash: string): readonly string[] {
    const permutationIdx = Base32.decode(hash);
    return nullthrows(
      PermutationsLazyArray.forPermutation(MARKET_DECK_PHASE_1).at(
        permutationIdx
      )
    ).slice(0, 7);
  }

  public strategies(): Strategy[] {
    return [Strategy.OFF, Strategy.RANDOM];
  }

  public resolveRandom(): string {
    const permutations =
      PermutationsLazyArray.forPermutation(MARKET_DECK_PHASE_1);
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    return Base32.encode(selectedIdx);
  }

  public renderInstanceContent(value: any): JSX.Element {
    return <MarketDisplayFixedInstructions hash={value as string} />;
  }
}
