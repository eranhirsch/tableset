import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import templateSlice from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import { Container as DragAndDropContainer, Draggable } from "react-smooth-dnd";
import nullthrows from "../../common/err/nullthrows";

function moveArray<T>(
  items: T[],
  removedIndex: number,
  addedIndex: number
): T[] {
  const clone = items.slice();
  const removedItem = clone.splice(removedIndex, 1);
  clone.splice(addedIndex, 0, ...removedItem);
  return clone;
}

export default function PlayerOrderConfig({
  order,
}: {
  order: EntityId[] | undefined;
}) {
  const dispatch = useAppDispatch();

  const players = useAppSelector(playersSelectors.selectEntities);

  const actualOrder = order ?? Object.keys(players);

  useEffect(() => {
    if (order == null) {
      // We need an initial value for order, we can set it once the component
      // mounts as it would show some order
      dispatch(
        templateSlice.actions.fixedValueSet({
          stepId: "playOrder",
          value: actualOrder,
        })
      );
    }
  }, [order, dispatch, actualOrder]);

  return (
    <List component="ol" dense>
      <DragAndDropContainer
        onDrop={({ removedIndex, addedIndex }) =>
          dispatch(
            templateSlice.actions.fixedValueSet({
              stepId: "playOrder",
              value: moveArray(
                actualOrder,
                nullthrows(removedIndex),
                nullthrows(addedIndex)
              ),
            })
          )
        }
      >
        {actualOrder.map((key) => {
          const value = players[key]!.name;
          return (
            <Draggable>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ height: 32, width: 32 }}>{value[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText>{value}</ListItemText>
                <ListItemSecondaryAction>
                  <ListItemIcon>
                    <DragHandleIcon />
                  </ListItemIcon>
                </ListItemSecondaryAction>
              </ListItem>
            </Draggable>
          );
        })}
      </DragAndDropContainer>
    </List>
  );
}
