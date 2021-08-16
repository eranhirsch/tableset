import { Avatar, Badge, Stack, useTheme } from "@material-ui/core";
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

function ColorAvatar({
  color,
  player,
  isDraggingOver,
  isUsingPlaceholder,
}: {
  color: GamePiecesColor;
  player: Player | undefined;
  isDraggingOver: boolean;
  isUsingPlaceholder: boolean;
}) {
  const theme = useTheme();

  return (
    <Avatar
      sx={{
        bgcolor: theme.palette[color].main,
        width: isDraggingOver ? 48 : undefined,
        height: isDraggingOver ? 48 : undefined,
        transitionProperty: "width, height",
        transitionDuration: `${isDraggingOver ? 200 : 65}ms`,
        transitionTimingFunction: "ease-out",
      }}
    >
      {player != null && !isUsingPlaceholder && (
        <Draggable draggableId={player.name} index={0}>
          {draggablePlayerRendererFactory(player)}
        </Draggable>
      )}
    </Avatar>
  );
}

function ColorChoice({
  color,
  player,
}: {
  color: GamePiecesColor;
  player: Player | undefined;
}) {
  return (
    <Droppable
      droppableId={color}
      renderClone={draggablePlayerRendererFactory(player)}
    >
      {(provided, snapshot) => (
        <Badge
          component="li"
          ref={provided.innerRef}
          {...provided.droppableProps}
          invisible={player == null || snapshot.isUsingPlaceholder}
          overlap="circular"
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          color={color}
        >
          <ColorAvatar
            color={color}
            player={player}
            isDraggingOver={snapshot.isDraggingOver}
            isUsingPlaceholder={snapshot.isUsingPlaceholder}
          />
        </Badge>
      )}
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
        component="ul"
        direction="row"
        alignItems="center"
        spacing={1}
        height={48}
      >
        {availableColors.map((color, index) => (
          <ColorChoice
            key={color}
            color={color}
            player={players[colorPlayers[color]]}
          />
        ))}
      </Stack>
    </DragDropContext>
  );
}
