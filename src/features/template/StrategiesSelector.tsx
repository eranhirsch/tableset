import { Chip, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { nullthrows, ReactUtils } from "common";
import { useGameStep } from "features/game/useGameStep";
import { Strategy } from "features/template/Strategy";
import { strategyLabel } from "features/template/strategyLabel";
import { StepId } from "model/IGame";
import { PlayerId } from "model/Player";
import React, { useCallback, useMemo } from "react";
import { playersSelectors } from "../players/playersSlice";
import { templateActions, templateSelectors } from "./templateSlice";

export function StrategiesSelector({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element {
  const gameStep = useGameStep(stepId);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];
  const template = useAppSelector(templateSelectors.selectEntities);
  const strategies = useMemo(
    () =>
      nullthrows(
        gameStep.strategies,
        `Missing strategies method for step ${stepId}`
      )({ template, playerIds }),
    [gameStep, playerIds, stepId, template]
  );

  const templateElement = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  return (
    <Stack direction="row" spacing={0.5}>
      {React.Children.toArray(
        strategies.map((strategy) => (
          <StrategyChip
            strategy={strategy}
            isSelected={
              (templateElement?.strategy ?? Strategy.OFF) === strategy
            }
            stepId={stepId}
          />
        ))
      )}
    </Stack>
  );
}

function StrategyChip({
  stepId,
  isSelected,
  strategy,
}: {
  stepId: StepId;
  isSelected: boolean;
  strategy: Strategy;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const gameStep = useGameStep(stepId);

  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const onClick = useCallback(
    () =>
      dispatch(
        strategy === Strategy.FIXED
          ? templateActions.enabledConstantValue(
              stepId,
              playerIds as PlayerId[]
            )
          : strategy === Strategy.OFF
          ? templateActions.disabled(stepId)
          : templateActions.enabled({
              id: stepId,
              strategy,
            })
      ),
    [dispatch, playerIds, stepId, strategy]
  );

  const label =
    strategy === Strategy.FIXED && gameStep.TemplateFixedValueSelector == null
      ? "Enabled"
      : strategyLabel(strategy);

  return (
    <Chip
      size="small"
      color="primary"
      variant={isSelected ? "filled" : "outlined"}
      label={label}
      onClick={!isSelected ? onClick : undefined}
    />
  );
}
