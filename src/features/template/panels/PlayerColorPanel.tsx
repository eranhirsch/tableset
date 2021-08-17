import { Avatar, Badge, Box, Stack, useTheme } from "@material-ui/core";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { availableItems } from "../../../core/games/concordia/SetupStep";
import {
  Player,
  selectors as playersSelectors,
} from "../../players/playersSlice";
import templateSlice, { PlayerColors } from "../templateSlice";
import short_name from "../../../common/short_name";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { GamePiecesColor } from "../../../core/themeWithGameColors";
import nullthrows from "../../../common/err/nullthrows";

function draggablePlayerRendererFactory(player: Player | undefined) {
  return (provided: DraggableProvided) => (
    <Avatar
      ref={provided.innerRef}
      {...provided.dragHandleProps}
      {...provided.draggableProps}
    >
      {short_name(nullthrows(player).name)}
    </Avatar>
  );
}

function DraggablePlayer({ player }: { player: Player }) {
  return (
    <Draggable draggableId={player.name} index={0}>
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
      renderClone={draggablePlayerRendererFactory(player)}
    >
      {(provided, snapshot) => {
        console.log(color, player, snapshot);
        return (
          <Badge
            component="li"
            ref={provided.innerRef}
            {...provided.droppableProps}
            invisible={player == null || snapshot.isUsingPlaceholder}
            overlap="circular"
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            color={color}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette[color].main,
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
                  snapshot.draggingFromThisWith === player.name) && (
                  <DraggablePlayer player={player} />
                )}
              <Box display="none">{provided.placeholder}</Box>
            </Avatar>
          </Badge>
        );
      }}
    </Droppable>
  );
}

export default function PlayerColorPanel({
  playerColors = {},
}: {
  playerColors: PlayerColors | undefined;
}) {
  const dispatch = useAppDispatch();

  const players = useAppSelector(playersSelectors.selectEntities);

  const availableColors = useMemo(() => availableItems("playerColor"), []);

  const colorPlayers = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(playerColors).map(([playerId, color]) => [
          color,
          playerId,
        ])
      ),
    [playerColors]
  );

  useEffect(() => {
    const playerIds = Object.keys(players);
    if (Object.keys(playerColors).length < playerIds.length) {
      const unassignedPlayerIds = playerIds.filter(
        (playerId) => playerColors[playerId] == null
      );
      const unassignedColors = availableColors.filter(
        (color) => colorPlayers[color] == null
      );
      const zipped = Object.fromEntries(
        unassignedPlayerIds.map((playerId, index) => [
          playerId,
          unassignedColors[index],
        ])
      );
      dispatch(
        templateSlice.actions.fixedValueSet({
          stepId: "playerColor",
          value: { ...playerColors, ...zipped },
        })
      );
    }
  }, [availableColors, colorPlayers, dispatch, playerColors, players]);

  const onDragEnd = useCallback(
    ({ destination, draggableId, reason }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        // User dropped the item outside of any destination
        return;
      }

      const destinationColor = destination.droppableId as GamePiecesColor;

      const newPlayerColors = { ...playerColors };

      const previousPlayerForColor = colorPlayers[destinationColor];
      if (previousPlayerForColor != null) {
        delete newPlayerColors[previousPlayerForColor];
      }

      newPlayerColors[draggableId] = destinationColor;

      dispatch(
        templateSlice.actions.fixedValueSet({
          stepId: "playerColor",
          value: newPlayerColors,
        })
      );
    },
    [colorPlayers, dispatch, playerColors]
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
        {availableColors.map((color, index) => (
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
