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

const getRenderPlayer =
  (player: Player | undefined) => (provided: DraggableProvided) => {
    return (
      <Avatar
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        sx={{ position: "absolute" }}
      >
        {short_name(player!.name)}
      </Avatar>
    );
  };

export default function PlayerColorPanel({
  playerColors = {},
}: {
  playerColors: PlayerColors | undefined;
}) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

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
      <Stack direction="row" alignItems="center" spacing={1} height={48}>
        {availableColors.map((color, index) => {
          const playerId = colorPlayers[color];
          const renderPlayer = getRenderPlayer(
            playerId != null ? players[playerId] : undefined
          );

          return (
            <Droppable droppableId={color} renderClone={renderPlayer}>
              {(provided, snapshot) => (
                <Badge
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  invisible={playerId == null || snapshot.isUsingPlaceholder}
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
                      transitionDuration: `${
                        snapshot.isDraggingOver ? 500 : 100
                      }ms`,
                      transitionTimingFunction: "ease-out",
                    }}
                  >
                    {""}
                  </Avatar>
                  {playerId != null && !snapshot.isUsingPlaceholder && (
                    <Draggable draggableId={playerId} index={0}>
                      {renderPlayer}
                    </Draggable>
                  )}
                </Badge>
              )}
            </Droppable>
          );
        })}
      </Stack>
    </DragDropContext>
  );
}
