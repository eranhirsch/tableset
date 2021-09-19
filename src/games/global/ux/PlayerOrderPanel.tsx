import { Avatar, Badge, Stack, Typography } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { PlayerId } from "../../../core/model/Player";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import templateSlice from "../../../features/template/templateSlice";
import Player from "./Player";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

function moveItem<T>(
  items: readonly T[],
  itemIdx: number,
  targetIdx: number
): T[] {
  const clone = items.slice();
  const [item] = clone.splice(itemIdx, 1);
  clone.splice(targetIdx, 0, item);
  return clone;
}

function DraggablePlayer({
  playerId,
  index,
}: {
  playerId: PlayerId;
  index: number;
  badgeContent?: string;
}) {
  return (
    <Draggable draggableId={`${playerId}`} index={index}>
      {(provided) => (
        <Avatar
          component="li"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <PlayerNameShortAbbreviation playerId={playerId} />
        </Avatar>
      )}
    </Draggable>
  );
}

function FirstAvatar() {
  const playerId = useAppSelector(firstPlayerIdSelector);
  return (
    <Badge
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={<LockIcon color="primary" fontSize="small" />}
    >
      <Player playerId={playerId} />
    </Badge>
  );
}

export default function PlayerOrderPanel({
  current: order,
}: {
  current: readonly PlayerId[];
}): JSX.Element {
  const dispatch = useAppDispatch();

  const onDragEnd = useCallback(
    ({ reason, source, destination }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        // Dropped out of the droppable
        return;
      }

      dispatch(
        templateSlice.actions.constantValueChanged({
          id: "playOrder",
          value: moveItem(order, source.index, destination.index),
        })
      );
    },
    [dispatch, order]
  );

  return (
    <Stack alignItems="center" direction="column" spacing={1}>
      <Stack direction="row" spacing={1}>
        <FirstAvatar />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="order" direction="horizontal">
            {(provided) => (
              <Stack
                ref={provided.innerRef}
                {...provided.droppableProps}
                component="ol"
                direction="row"
                sx={{ padding: 0 }}
                spacing={1}
              >
                {order.map((playerId, idx) => (
                  <DraggablePlayer
                    key={playerId}
                    playerId={playerId}
                    index={idx}
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
      <Typography variant="caption">{"In clockwise order"}</Typography>
    </Stack>
  );
}
