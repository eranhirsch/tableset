import { Avatar, Badge, Box, Stack, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Dict, invariant_violation } from "common";
import { playersSelectors } from "features/players/playersSlice";
import { templateActions } from "features/template/templateSlice";
import GamePiecesColor from "model/GamePiecesColor";
import { Player } from "model/Player";
import { useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { PlayerColors } from "../steps/createPlayerColorsStep";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

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

export default function PlayerColorPanel({
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
      const isSlotAvailble = (slot: number): boolean => {
        const colorAtSlot = availableColors[slot];
        return (
          colorAtSlot != null &&
          (colorAtSlot === treatAsAvailable ||
            colorPlayers[colorAtSlot] == null)
        );
      };

      const currentPos = availableColors.findIndex((color) => color === start);

      for (let distance = 1; distance < availableColors.length; distance += 1) {
        if (isSlotAvailble(currentPos - distance)) {
          return availableColors[currentPos - distance];
        }

        if (isSlotAvailble(currentPos + distance)) {
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
