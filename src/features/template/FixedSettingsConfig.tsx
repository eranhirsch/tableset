import { Chip } from "@material-ui/core";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { availableItems } from "../../core/games/concordia/SetupStep";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";

export default function FixedSettingsConfig({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  const players = useAppSelector(playersSelectors.selectAll);

  const items =
    step.name === "startingPlayer"
      ? players.map(({ name }) => name)
      : availableItems(step.name) ?? [];

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
