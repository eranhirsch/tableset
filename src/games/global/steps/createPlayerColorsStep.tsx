import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import PlayerColors from "../../../common/PlayerColors";
import { Strategy } from "../../../core/Strategy";
import { GamePiecesColor } from "../../../core/themeWithGameColors";
import { createGameStep } from "../../core/steps/createGameStep";
import IGameStep from "../../core/steps/IGameStep";
import PlayerColorPanel from "../ux/PlayerColorPanel";
import PlayersColorsFixedTemplateLabel from "../ux/PlayerColorsFixedTemplateLabel";
import { PlayerColorsPanel } from "../ux/PlayerColorsPanel";

export default function createPlayerColorsStep(
  availableColors: readonly GamePiecesColor[]
): IGameStep<PlayerColors> {
  return createGameStep({
    id: "playerColors",
    labelOverride: "Colors",

    derivers: {
      renderInstanceItem: (playerColors) => (
        <PlayerColorsPanel playerColor={playerColors} />
      ),

      random({ playerIds }) {
        const permutations =
          PermutationsLazyArray.forPermutation(availableColors);
        const selectedIdx = Math.floor(Math.random() * permutations.length);
        const permutation = nullthrows(permutations.at(selectedIdx));
        return Object.fromEntries(
          playerIds.map((playerId, index) => [playerId, permutation[index]])
        );
      },

      fixed: {
        renderSelector: (current) => (
          <PlayerColorPanel
            availableColors={availableColors}
            playerColors={current}
          />
        ),
        renderTemplateLabel: (current) => (
          <PlayersColorsFixedTemplateLabel value={current} />
        ),

        initializer(playerIds) {
          if (playerIds.length < 1) {
            // No one to assign colors to
            return;
          }

          if (playerIds.length > availableColors.length) {
            // Too many players, not enough colors
            return;
          }

          return {
            id: "playerColors",
            strategy: Strategy.FIXED,
            value: Object.fromEntries(
              playerIds.map((playerId, index) => [
                playerId,
                availableColors[index],
              ])
            ),
          };
        },
      },
    },
  });
}
