import {
  Avatar,
  Badge,
  Box,
  Chip,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { colorName } from "app/ux/themeWithGameColors";
import { Dict, invariant_violation, Shape, Vec } from "common";
import { playersSelectors } from "features/players/playersSlice";
import { templateActions } from "features/template/templateSlice";
import GamePiecesColor from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import React, { useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult
} from "react-beautiful-dnd";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { PlayerNameShortAbbreviation } from "../../../features/players/PlayerNameShortAbbreviation";
import { PlayerShortName } from "../../../features/players/PlayerShortName";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";

export type PlayerColors = Readonly<Record<PlayerId, GamePiecesColor>>;

const createPlayerColorsStep = (availableColors: readonly GamePiecesColor[]) =>
  createVariableGameStep<PlayerColors, readonly PlayerId[]>({
    id: "playerColors",
    labelOverride: "Colors",

    dependencies: [
      createPlayersDependencyMetaStep({ max: availableColors.length }),
    ],

    InstanceVariableComponent,
    InstanceManualComponent: () => InstanceManualComponent({ availableColors }),

    random: (playerIds) =>
      Dict.associate(
        playerIds,
        Vec.shuffle(Vec.sample(availableColors, playerIds.length))
      ),

    fixed: {
      renderSelector: ({ current }) => (
        <Selector availableColors={availableColors} playerColors={current} />
      ),
      renderTemplateLabel: TemplateLabel,

      initializer: (playerIds) =>
        playerIds.length >= 1 && playerIds.length <= availableColors.length
          ? Dict.associate(playerIds, availableColors)
          : undefined,

      refresh(current, playerIds) {
        const stillActivePlayerColors = Dict.select_keys(current, playerIds);
        const colorlessPlayers = Vec.diff(playerIds, Vec.keys(current));

        return Dict.merge(
          stillActivePlayerColors,
          // Associate an available color for each player without a color
          Dict.associate(
            colorlessPlayers,
            // Colors that aren't used by active players
            Vec.diff(availableColors, Vec.values(stillActivePlayerColors))
          )
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
            <PlayerAvatar playerId={playerId} />
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

function TemplateLabel({ value }: { value: PlayerColors }): JSX.Element {
  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map_with_key(value, (playerId, color) => (
          <Chip
            component="span"
            size="small"
            color={color}
            label={<PlayerShortName playerId={playerId} />}
          />
        ))
      )}
    </GrammaticalList>
  );
}

function Selector({
  availableColors,
  playerColors,
}: {
  availableColors: readonly GamePiecesColor[];
  playerColors: PlayerColors;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const players = useAppSelector(playersSelectors.selectEntities);

  // We need the data indexed by color too
  const colorPlayerIds = useMemo(
    () => Shape.flip(playerColors),
    [playerColors]
  );

  const closestAvailableColor = useCallback(
    (
      start: GamePiecesColor,
      treatAsAvailable: GamePiecesColor
    ): GamePiecesColor => {
      const isSlotAvailable = (slot: number): boolean => {
        const colorAtSlot = availableColors[slot];
        return (
          colorAtSlot != null &&
          (colorAtSlot === treatAsAvailable ||
            colorPlayerIds[colorAtSlot] == null)
        );
      };

      const currentPos = availableColors.findIndex((color) => color === start);

      for (let distance = 1; distance < availableColors.length; distance += 1) {
        if (isSlotAvailable(currentPos - distance)) {
          return availableColors[currentPos - distance];
        }

        if (isSlotAvailable(currentPos + distance)) {
          return availableColors[currentPos + distance];
        }
      }

      invariant_violation("Couldn't find an available color!");
    },
    [availableColors, colorPlayerIds]
  );

  const onDragEnd = useCallback(
    ({ draggableId, source, destination, reason }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        // User dropped the item outside of any destination
        return;
      }

      const destinationColor = destination.droppableId as GamePiecesColor;
      const newColors = {
        ...playerColors,
        [draggableId]: destinationColor,
      };

      const destinationPlayer = colorPlayerIds[destinationColor];
      if (destinationPlayer != null && destinationPlayer !== draggableId) {
        // In case the drag caused us to assign a color that is already used by
        // a different player we need to update that player to use a different
        // color.
        newColors[destinationPlayer] = closestAvailableColor(
          destinationColor,
          source.droppableId as GamePiecesColor
        );
      }

      dispatch(
        templateActions.constantValueChanged({
          id: "playerColors",
          value: newColors,
        })
      );
    },
    [closestAvailableColor, colorPlayerIds, dispatch, playerColors]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack
        pl={0}
        component="ul"
        direction="row"
        alignItems="center"
        spacing={1}
        height={48}
      >
        {Vec.map(availableColors, (color) => (
          <ColorSlot
            key={color}
            color={color}
            playerId={colorPlayerIds[color]}
          />
        ))}
      </Stack>
    </DragDropContext>
  );
}

const draggablePlayerRendererFactory =
  (playerId: PlayerId) => (provided: DraggableProvided) =>
    (
      <Avatar
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
      >
        <PlayerNameShortAbbreviation playerId={playerId} />
      </Avatar>
    );

function DraggablePlayer({ playerId }: { playerId: PlayerId }) {
  return (
    <Draggable draggableId={playerId} index={0}>
      {draggablePlayerRendererFactory(playerId)}
    </Draggable>
  );
}

function ColorSlot({
  color,
  playerId,
}: {
  color: GamePiecesColor;
  playerId: PlayerId | undefined;
}) {
  const theme = useTheme();

  return (
    <Droppable
      droppableId={color}
      // We need to clone the dragged item as we move it between lists
      renderClone={
        playerId != null ? draggablePlayerRendererFactory(playerId) : undefined
      }
    >
      {(provided, snapshot) => (
        <Badge
          // We are part of a UL of colors
          component="li"
          ref={provided.innerRef}
          {...provided.droppableProps}
          color={color}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          overlap="circular"
          invisible={
            // We don't need a badge when there's no avatar hiding the
            // background color
            playerId == null ||
            snapshot.isDraggingOver ||
            snapshot.draggingFromThisWith === playerId
          }
        >
          <Avatar
            // We use an avatar component for the colored background because we
            // would "cover" it with another avatar for assigned players
            sx={{
              bgcolor: theme.palette[color].main,

              // Create a transition effect to make the color apparent while
              // being dragged over.
              width: snapshot.isDraggingOver ? 48 : undefined,
              height: snapshot.isDraggingOver ? 48 : undefined,
              transitionProperty: "width, height",
              transitionDuration: `${snapshot.isDraggingOver ? 200 : 65}ms`,
              transitionTimingFunction: "ease-out",
            }}
          >
            {playerId != null &&
              // We need to remove players occupying slots we are dragging so
              // they don't render and move around, but we don't want to do
              // this to the source slot where our item originated from
              (!snapshot.isDraggingOver ||
                snapshot.draggingFromThisWith === playerId) && (
                <DraggablePlayer playerId={playerId} />
              )}
            <Box display="none">
              {
                // We hide the placeholder as we don't need it, we have a single
                // item list, and we don't want any animations.
                // react-beautiful-dnd doesn't permit us to remove it entirely!
                provided.placeholder
              }
            </Box>
          </Avatar>
        </Badge>
      )}
    </Droppable>
  );
}
