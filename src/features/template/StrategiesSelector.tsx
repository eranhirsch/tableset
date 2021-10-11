import { Chip, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { allExpansionIdsSelector } from "features/expansions/expansionsSlice";
import { gameStepSelector } from "features/game/gameSlice";
import { Strategy } from "features/template/Strategy";
import { strategyLabel } from "features/template/strategyLabel";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { ProductId, StepId } from "model/Game";
import { PlayerId } from "model/Player";
import React, { useCallback } from "react";
import { playersSelectors } from "../players/playersSlice";
import { templateActions, templateSelectors } from "./templateSlice";

export function StrategiesSelector({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element {
  const step = useAppSelector(gameStepSelector(stepId)) as RandomGameStep;
  const strategies = [Strategy.OFF, Strategy.RANDOM];
  if (step.initialFixedValue != null) {
    strategies.push(Strategy.FIXED);
  }

  const element = ReactUtils.useAppEntityIdSelectorNullable(
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
              (element == null && strategy === Strategy.OFF) ||
              element?.strategy === strategy
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

  const gameStep = useAppSelector(gameStepSelector(stepId)) as RandomGameStep;

  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];
  const productIds = useAppSelector(
    allExpansionIdsSelector
  ) as readonly ProductId[];

  const onClick = useCallback(
    () =>
      dispatch(
        strategy === Strategy.FIXED
          ? templateActions.enabledConstantValue(stepId, {
              playerIds,
              productIds,
            })
          : strategy === Strategy.OFF
          ? templateActions.disabled(stepId)
          : templateActions.enabled(stepId)
      ),
    [dispatch, playerIds, productIds, stepId, strategy]
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
