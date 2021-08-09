import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { availableItems } from "../../core/games/concordia/SetupStep";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import { Container as DragAndDropContainer, Draggable } from "react-smooth-dnd";
import { type_invariant } from "../../common/err/invariant";

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

function PlayerOrderConfig({ order }: { order: EntityId[] | undefined }) {
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
              value: moveArray(actualOrder, removedIndex!, addedIndex!),
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

export default function FixedSettingsConfig({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  if (step.name === "playOrder") {
    return (
      <PlayerOrderConfig
        order={
          step.value == null
            ? undefined
            : type_invariant(step.value, Array.isArray)
        }
      />
    );
  }

  const items = availableItems(step.name) ?? [];
  return (
    <>
      {items.map((item) => (
        <Chip
          key={`${step.name}_${item}`}
          variant={step.value === item ? "filled" : "outlined"}
          label={item}
          onClick={() =>
            dispatch(
              step.value === item
                ? templateSlice.actions.fixedValueCleared(step.name)
                : templateSlice.actions.fixedValueSet({
                    stepId: step.name,
                    value: item,
                  })
            )
          }
        />
      ))}
    </>
  );
}
