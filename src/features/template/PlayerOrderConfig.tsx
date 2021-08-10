import { Avatar, Stack, useTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import templateSlice from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

function moveItem<T>(items: T[], itemIdx: number, targetIdx: number): T[] {
  const clone = items.slice();
  const [item] = clone.splice(itemIdx, 1);
  clone.splice(targetIdx, 0, item);
  return clone;
}

export default function PlayerOrderConfig({
  order = [],
}: {
  order?: EntityId[];
}) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsExpanded(true), 650);
  }, [setIsExpanded]);

  const players = useAppSelector(playersSelectors.selectEntities);

  useEffect(() => {
    if (order.length === 0) {
      // We need an initial value for order, we can set it once the component
      // mounts as it would show some order
      dispatch(
        templateSlice.actions.fixedValueSet({
          stepId: "playOrder",
          value: Object.keys(players),
        })
      );
    }
  }, [order, dispatch, players]);

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        if (result.destination == null) {
          return;
        }

        dispatch(
          templateSlice.actions.fixedValueSet({
            stepId: "playOrder",
            value: moveItem(
              order,
              result.source.index,
              result.destination.index
            ),
          })
        );
      }}
    >
      <Droppable
        droppableId="playerOrder"
        direction="horizontal"
        isDropDisabled={!isExpanded}
      >
        {(provided, snapshot) => (
          <Stack
            component="ol"
            ref={provided.innerRef}
            direction="row"
            sx={{ padding: 0 }}
            spacing={isExpanded ? 1 : -1.5}
          >
            {order.map((playerId, idx) => {
              const playerName = players[playerId]!.name;
              const [first, last] = playerName.split(" ");
              return (
                <Draggable
                  key={playerId}
                  draggableId={`${playerId}`}
                  index={idx}
                  isDragDisabled={!isExpanded}
                >
                  {(provided) => (
                    <Avatar
                      sx={{
                        backgroundColor: isExpanded
                          ? theme.palette.primary.main
                          : undefined,

                        // Mimic the AvatarGroup styling
                        zIndex: order.length - idx,
                        borderWidth: "2px",
                        borderColor: "white",
                        borderStyle: "solid",

                        // Playing around with some visual flare.
                        // TODO: The transition effect also triggers after
                        // finishing a drag when the individual avatars render
                        // again because of the new order and the margin for the
                        // stack is updated. We can probably do better here by
                        // detecting that specific use-case and removing the
                        // transition
                        transition:
                          "margin 280ms cubic-bezier(0, 0.71, 0.26, 1.9), background-color 20ms ease-out 280ms",
                      }}
                      component="li"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >{`${first[0]}${last[0]}`}</Avatar>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
}
