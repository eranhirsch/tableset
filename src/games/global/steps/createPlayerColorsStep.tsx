import nullthrows from "../../../common/err/nullthrows";
import array_zip from "../../../common/lib_utils/array_zip";
import map_keys from "../../../common/lib_utils/map_keys";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import PlayerColors from "../../../common/PlayerColors";
import { GamePiecesColor } from "../../../core/themeWithGameColors";
import { PlayerId } from "../../../features/players/playersSlice";
import createVariableGameStep from "../../core/steps/createVariableGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import PlayerColorPanel from "../ux/PlayerColorPanel";
import PlayersColorsFixedTemplateLabel from "../ux/PlayerColorsFixedTemplateLabel";
import PlayerColorsPanel from "../ux/PlayerColorsPanel";

const createPlayerColorsStep = (availableColors: readonly GamePiecesColor[]) =>
  createVariableGameStep<PlayerColors, readonly PlayerId[]>({
    id: "playerColors",
    labelOverride: "Colors",

    dependencies: [
      createPlayersDependencyMetaStep({ min: 1, max: availableColors.length }),
    ],

    render: PlayerColorsPanel,

    random(playerIds) {
      const permutations =
        PermutationsLazyArray.forPermutation(availableColors);
      const selectedIdx = Math.floor(Math.random() * permutations.length);
      const permutation = nullthrows(permutations.at(selectedIdx));
      return Object.fromEntries(
        playerIds.map((playerId, index) => [playerId, permutation[index]])
      );
    },

    fixed: {
      renderSelector: ({ current }) => (
        <PlayerColorPanel
          availableColors={availableColors}
          playerColors={current}
        />
      ),
      renderTemplateLabel: PlayersColorsFixedTemplateLabel,

      initializer(playerIds) {
        if (playerIds.length < 1) {
          // No one to assign colors to
          return;
        }

        if (playerIds.length > availableColors.length) {
          // Too many players, not enough colors
          return;
        }

        return array_zip(playerIds, availableColors);
      },

      refresh(current, playerIds) {
        const remainingColors = Object.entries(current).reduce(
          (remainingColors, [playerId, color]) =>
            playerIds.includes(playerId)
              ? remainingColors.filter((c) => color !== c)
              : remainingColors,
          availableColors as GamePiecesColor[]
        );
        return map_keys(
          playerIds,
          (playerId) => current[playerId] ?? remainingColors.shift()
        );
      },
    },
  });
export default createPlayerColorsStep;
