import { Avatar, Badge, Chip, Stack, Typography } from "@material-ui/core";
import { useAppSelector } from "../../../app/hooks";
import nullthrows from "../../../common/err/nullthrows";
import array_map_keys from "../../../common/lib_utils/array_map_keys";
import array_zip from "../../../common/lib_utils/array_zip";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import PlayerColors from "../../../common/PlayerColors";
import { shortest_unique_abbreviation } from "../../../common/shortest_names";
import { colorName, GamePiecesColor } from "../../../core/themeWithGameColors";
import {
  allPlayerNamesSelector,
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import PlayerColorPanel from "../ux/PlayerColorPanel";
import PlayersColorsFixedTemplateLabel from "../ux/PlayerColorsFixedTemplateLabel";

const createPlayerColorsStep = (availableColors: readonly GamePiecesColor[]) =>
  createVariableGameStep<PlayerColors, readonly PlayerId[]>({
    id: "playerColors",
    labelOverride: "Colors",

    dependencies: [
      createPlayersDependencyMetaStep({ min: 1, max: availableColors.length }),
    ],

    InstanceVariableComponent,
    InstanceManualComponent: () => InstanceManualComponent({ availableColors }),

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
        return array_map_keys(
          playerIds,
          (playerId) => current[playerId] ?? remainingColors.shift()
        );
      },
    },
  });
export default createPlayerColorsStep;

function InstanceVariableComponent({
  value: playerColor,
}: VariableStepInstanceComponentProps<PlayerColors>): JSX.Element {
  const players = useAppSelector(playersSelectors.selectEntities);
  const allNames = useAppSelector(allPlayerNamesSelector);

  return (
    <>
      <Typography variant="body1">
        Each player is assigned the following colors:
      </Typography>
      <Stack direction="row" spacing={1} component="figure">
        {Object.entries(playerColor).map(([playerId, color]) => (
          <Badge
            key={playerId}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            overlap="circular"
            invisible={false}
            color={color}
          >
            <Avatar>
              {shortest_unique_abbreviation(
                nullthrows(players[playerId]).name,
                allNames
              )}
            </Avatar>
          </Badge>
        ))}
      </Stack>
    </>
  );
}

function InstanceManualComponent({
  availableColors,
}: {
  availableColors: readonly GamePiecesColor[];
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          Available colors:{" "}
          <GrammaticalList>
            {availableColors.map((color) => (
              <Chip
                key={`available_color_${color}`}
                variant="filled"
                color={color}
                size="small"
                label={colorName(color)}
              />
            ))}
          </GrammaticalList>
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Each player picks a color
          <Footnote index={1} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
