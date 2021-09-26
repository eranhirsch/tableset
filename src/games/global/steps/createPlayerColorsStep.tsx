import {
  Avatar,
  Badge,
  Box,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { colorName } from "app/ux/themeWithGameColors";
import { C, Dict, invariant_violation, Vec } from "common";
import { playersSelectors } from "features/players/playersSlice";
import { templateActions } from "features/template/templateSlice";
import GamePiecesColor from "model/GamePiecesColor";
import { Player, PlayerId } from "model/Player";
import React, { useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { PlayerAvatar } from "../ux/PlayerAvatar";
import { PlayerNameShortAbbreviation } from "../ux/PlayerNameShortAbbreviation";
import { PlayerShortName } from "../ux/PlayerShortName";

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
        <Selector availableColors={availableColors} playerColors={current} />
      ),
      renderTemplateLabel: TemplateLabel,

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
            <PlayerAvatar playerId={playerId as PlayerId} />
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
            // TODO: Something about the typing of Vec.map_with_key isn't
            // inferring the keys of the Record properly, sending a number type
            // here. We need to fix the typing there and then remove the `as`
            // here
            label={<PlayerShortName playerId={playerId as PlayerId} />}
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
  const colorPlayers = useMemo(
    () => Object.freeze(Dict.flip(playerColors)),
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
            colorPlayers[colorAtSlot] == null)
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
    [availableColors, colorPlayers]
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

      const destinationPlayer = colorPlayers[destinationColor];
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
    [closestAvailableColor, colorPlayers, dispatch, playerColors]
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
        {availableColors.map((color) => (
          <ColorSlot
            key={color}
            color={color}
            player={players[colorPlayers[color]]}
          />
        ))}
      </Stack>
    </DragDropContext>
  );
}

const draggablePlayerRendererFactory =
  (player: Player) => (provided: DraggableProvided) =>
    (
      <Avatar
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
      >
        <PlayerNameShortAbbreviation playerId={player.id} />
      </Avatar>
    );

function DraggablePlayer({ player }: { player: Player }) {
  return (
    <Draggable draggableId={player.id} index={0}>
      {draggablePlayerRendererFactory(player)}
    </Draggable>
  );
}

function ColorSlot({
  color,
  player,
}: {
  color: GamePiecesColor;
  player: Player | undefined;
}) {
  const theme = useTheme();

  return (
    <Droppable
      droppableId={color}
      // We need to clone the dragged item as we move it between lists
      renderClone={
        player != null ? draggablePlayerRendererFactory(player) : undefined
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
            player == null ||
            snapshot.isDraggingOver ||
            snapshot.draggingFromThisWith === player.id
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
            {player != null &&
              // We need to remove players occupying slots we are dragging so
              // they don't render and move around, but we don't want to do
              // this to the source slot where our item originated from
              (!snapshot.isDraggingOver ||
                snapshot.draggingFromThisWith === player.id) && (
                <DraggablePlayer player={player} />
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
