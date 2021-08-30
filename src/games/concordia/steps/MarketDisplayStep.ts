import Base32 from "../../../common/Base32";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import IGameStep from "../../IGameStep";
import ConcordiaGame from "../ConcordiaGame";

export default class MarketDisplayStep implements IGameStep {
  public readonly id: string = "marketDisplay";
  public readonly label: string = "Cards Display";

  public resolveRandom(): string {
    const permutations = PermutationsLazyArray.forPermutation(
      ConcordiaGame.MARKET_DECK_PHASE_1
    );
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    return Base32.encode(selectedIdx);
  }
}
