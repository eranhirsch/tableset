import { Badge, Chip, Stack, Typography } from "@mui/material";
import { colorName } from "app/ux/themeWithGameColors";
import { Vec } from "common";
import PermutationsLazyArray from "common/PermutationsLazyArray";
import { array_map_keys } from "common/standard_library/array_map_keys";
import GamePiecesColor from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import Player from "../ux/Player";
import PlayerColorPanel from "../ux/PlayerColorPanel";
import PlayersColorsFixedTemplateLabel from "../ux/PlayerColorsFixedTemplateLabel";

export type PlayerColors = Readonly<{
  [playerId: string]: GamePiecesColor;
}>;

const createPlayerColorsStep = (availableColors: readonly GamePiecesColor[]) =>
  createVariableGameStep<PlayerColors, readonly PlayerId[]>({
    id: "playerColors",
    labelOverride: "Colors",

    dependencies: [
      createPlayersDependencyMetaStep({ min: 1, max: availableColors.length }),
    ],

    InstanceVariableComponent,
    InstanceManualComponent: () => InstanceManualComponent({ availableColors }),

    random: (playerIds) =>
      Object.fromEntries(
        Vec.zip(
          playerIds,
          Vec.random_item(PermutationsLazyArray.of(availableColors))
        )
      ),

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

        return Object.fromEntries(Vec.zip(playerIds, availableColors));
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
            <Player playerId={playerId} />
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
                label={colorName[color]}
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
