import { Chip, Stack } from "@material-ui/core";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import ConcordiaGame, {
  SetupStepName,
} from "../../core/games/concordia/ConcordiaGame";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { Strategy } from "../../core/Strategy";

export default function StrategiesSelector({
  stepId,
}: {
  stepId: SetupStepName;
}) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorNullable(templateStepSelectors, stepId);

  const steps = useAppSelector(templateStepSelectors.selectEntities);
  const strategies = useMemo(
    () => ConcordiaGame.strategiesFor(stepId, steps),
    [stepId, steps]
  );

  const stepStrategy = step?.strategy ?? Strategy.OFF;

  return (
    <Stack direction="row" spacing={0.5}>
      {strategies.map((strategy) => (
        <Chip
          key={strategy}
          size="small"
          color="primary"
          variant={stepStrategy === strategy ? "filled" : "outlined"}
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
