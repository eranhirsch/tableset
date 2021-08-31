import { Avatar, Badge, Stack, Typography } from "@material-ui/core";
import { useCallback } from "react";
import {
  Draggable,
  DropResult,
  DragDropContext,
  Droppable,
} from "react-beautiful-dnd";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import invariant_violation from "../../common/err/invariant_violation";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";
import short_name from "../../common/short_name";
import { Strategy } from "../../core/Strategy";
import {
  PlayerId,
  selectors as playersSelectors,
} from "../../features/players/playersSlice";
import templateSlice, {
  selectors as templateSelectors,
} from "../../features/template/templateSlice";
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
  playerId: PlayerId;
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

function FirstAvatar() {
  const player = useAppSelector(
    (state) => playersSelectors.selectAll(state)[0]
  );
  return (
    <Badge
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={<LockIcon color="primary" fontSize="small" />}
    >
      <Avatar>{short_name(player.name)}</Avatar>
    </Badge>
  );
}

export default function PlayerOrderPanel() {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateSelectors, "playOrder");
  if (
    step.id !== "playOrder" ||
    step.strategy !== Strategy.FIXED ||
    !step.global
  ) {
    invariant_violation(`Step ${step} is misconfigured for this panel`);
  }
  const order = step.value;

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
          global: true,
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
