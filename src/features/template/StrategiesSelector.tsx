import { Chip, Stack } from "@material-ui/core";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import ConcordiaGame, {
  SetupStepName,
} from "../../games/concordia/ConcordiaGame";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { Strategy } from "../../core/Strategy";
import { selectors as playersSelectors } from "../players/playersSlice";
import { gameIdSelector } from "../game/gameSlice";

export default function StrategiesSelector({
  stepId,
}: {
  stepId: SetupStepName;
}) {
  const dispatch = useAppDispatch();

  const gameId = useAppSelector(gameIdSelector);
  const step = useAppEntityIdSelectorNullable(templateStepSelectors, stepId);
  const steps = useAppSelector(templateStepSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds);
  const playersTotal = useAppSelector(playersSelectors.selectTotal);

  const strategies = useMemo(
    () => ConcordiaGame.strategiesFor(stepId, steps, playersTotal),
    [playersTotal, stepId, steps]
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
          onClick={
            strategy !== stepStrategy
              ? () =>
                  dispatch(
                    strategy === Strategy.FIXED
                      ? templateSlice.actions.enabledConstantValue(
                          stepId,
                          gameId,
                          playerIds
                        )
                      : strategy === Strategy.OFF
                      ? templateSlice.actions.disabled(stepId, playersTotal)
                      : templateSlice.actions.enabled({
                          id: stepId,
                          strategy,
                        })
                  )
              : undefined
          }
        />
      ))}
    </Stack>
  );
}
