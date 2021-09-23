import { Badge, Chip, Stack, Typography } from "@mui/material";
import { colorName } from "app/ux/themeWithGameColors";
import { C, Dict, Vec } from "common";
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
      Dict.associate(playerIds, Vec.shuffle(availableColors)),

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

        return Dict.associate(playerIds, availableColors);
      },

      refresh(current, playerIds) {
        const remainingColors = C.reduce_with_key(
          current,
          (remainingColors, playerId, color) =>
            // TODO: Something about the typing of C.reduce_with_key isn't
            // inferring the keys of the Record properly, sending a number type
            // here. We need to fix the typing there and then remove the `as`
            // here
            playerIds.includes(playerId as PlayerId)
              ? remainingColors.filter((c) => color !== c)
              : remainingColors,
          availableColors as GamePiecesColor[]
        );
        return Dict.from_keys(
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
        {Vec.map_with_key(playerColor, (playerId, color) => (
          <Badge
            key={playerId}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            overlap="circular"
            invisible={false}
            color={color}
          >
            {/* TODO: Something about the typing of Vec.map_with_key isn't 
            inferring the keys of the Record properly, sending a number type 
            here. We need to fix the typing there and then remove the `as` here 
            */}
            <Player playerId={playerId as PlayerId} />
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
