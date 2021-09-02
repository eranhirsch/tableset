import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { Strategy } from "../../../core/Strategy";
import { PlayerId } from "../../../features/players/playersSlice";
import { createDerivedGameStep } from "../../core/steps/createDerivedGameStep";
import PlayerOrderPanel from "../ux/PlayerOrderPanel";
import PlayOrderFixedTemplateLabel from "../ux/PlayOrderFixedTemplateLabel";
import { PlayOrderPanel } from "../ux/PlayOrderPanel";

export default createDerivedGameStep({
  id: "playOrder",
  labelOverride: "Seating",

  isType: (x): x is PlayerId[] =>
    Array.isArray(x) && x.every((y) => typeof y === "string"),

  renderInstanceItem: (playOrder: readonly PlayerId[]) => (
    <PlayOrderPanel playOrder={playOrder} />
  ),

  random({ playerIds }) {
    const [, ...restOfPlayers] = playerIds;
    const permutations = PermutationsLazyArray.forPermutation(restOfPlayers);
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    return nullthrows(permutations.at(selectedIdx));
  },

  fixed: {
    renderSelector: (playOrder) => <PlayerOrderPanel order={playOrder} />,
    renderTemplateLabel: (current) => (
      <PlayOrderFixedTemplateLabel value={current} />
    ),

    initializer(playerIds) {
      if (playerIds.length < 3) {
        // Play order is meaningless with 2 players
        return;
      }

      const [, ...restOfPlayers] = playerIds;
      return {
        id: "playOrder",
        strategy: Strategy.FIXED,
        value: restOfPlayers,
      };
    },
  },
});