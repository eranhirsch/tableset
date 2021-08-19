import { Avatar, Stack, Badge } from "@material-ui/core";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import templateSlice from "../templateSlice";
import { selectors as playersSelectors } from "../../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import short_name from "../../../common/short_name";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import LockIcon from "@material-ui/icons/Lock";

function moveItem<T>(items: T[], itemIdx: number, targetIdx: number): T[] {
  const clone = items.slice();
  const [item] = clone.splice(itemIdx, 1);
  clone.splice(targetIdx, 0, item);
  return clone;
}

function DraggablePlayer({
  playerId,
  index,
}: {
  playerId: EntityId;
  index: number;
  badgeContent?: string;
}) {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);

  return (
    <Draggable draggableId={`${playerId}`} index={index}>
      {(provided) => (
        <Avatar
          component="li"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {short_name(player.name)}
        </Avatar>
      )}
    </Draggable>
  );
}

function FirstAvatar({ playerId }: { playerId: EntityId }) {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  return (
    <Badge
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={<LockIcon fontSize="small" />}
    >
      <Avatar>{short_name(player.name)}</Avatar>
    </Badge>
  );
}

export default function PlayerOrderPanelV2({
  order = [],
}: {
  order: EntityId[] | undefined;
}) {
  const dispatch = useAppDispatch();

  const playerIds = useAppSelector(playersSelectors.selectIds);
  const sortedPlayerIds = useMemo(() => [...playerIds].sort(), [playerIds]);

  useEffect(() => {
    if (
      order.length < sortedPlayerIds.length ||
      order.some((playerId) => !sortedPlayerIds.includes(playerId))
    ) {
      // We need an initial value for order, we can set it once the component
      // mounts as it would show some order
      dispatch(
        templateSlice.actions.fixedValueSet({
          stepId: "playOrder",
          value: sortedPlayerIds,
        })
      );
    }
  }, [dispatch, order, sortedPlayerIds]);

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
        templateSlice.actions.fixedValueSet({
          stepId: "playOrder",
          value: moveItem(order, source.index + 1, destination.index + 1),
        })
      );
    },
    [dispatch, order]
  );

  return (
    <Stack direction="row" spacing={2}>
      {order.length >= 1 && <FirstAvatar playerId={order[0]} />}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="order" direction="horizontal">
          {(provided) => (
            <Stack
              ref={provided.innerRef}
              {...provided.droppableProps}
              component="ol"
              direction="row"
              sx={{ padding: 0 }}
              spacing={2}
            >
              {order.slice(1).map((playerId, idx) => (
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
  );
}
