import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import PlayerColors from "../../../common/PlayerColors";
import Strategy from "../../../core/Strategy";
import { GamePiecesColor } from "../../../core/themeWithGameColors";
import createVariableGameStep from "../../core/steps/createVariableGameStep";
import PlayerColorPanel from "../ux/PlayerColorPanel";
import PlayersColorsFixedTemplateLabel from "../ux/PlayerColorsFixedTemplateLabel";
import PlayerColorsPanel from "../ux/PlayerColorsPanel";

const createPlayerColorsStep = (availableColors: readonly GamePiecesColor[]) =>
  createVariableGameStep({
    id: "playerColors",
    labelOverride: "Colors",

    renderInstanceItem: (playerColors: PlayerColors) => (
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
  });
export default createPlayerColorsStep;