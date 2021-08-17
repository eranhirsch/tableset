import { Chip, Stack } from "@material-ui/core";
import React from "react";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import { availableStrategies } from "../../core/games/concordia/SetupStep";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";

export default function StrategiesSelector({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  const steps = useAppSelector(templateStepSelectors.selectEntities);
  const strategies = useMemo(
    () => availableStrategies(step.name, steps),
    [step, steps]
  );

  return (
    <Stack direction="row" spacing={0.5}>
      {strategies.map((strategy) => (
        <Chip
          key={strategy}
          size="small"
          color="primary"
          variant={step.strategy === strategy ? "filled" : "outlined"}
          label={strategyLabel(strategy)}
          onClick={() =>
            dispatch(
              templateSlice.actions.strategySwapped({
                id: stepId,
                strategy,
              })
            )
          }
        />
      ))}
    </Stack>
  );
}
