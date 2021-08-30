import { Chip, Stack } from "@material-ui/core";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { Strategy } from "../../core/Strategy";
import { selectors as playersSelectors } from "../players/playersSlice";
import { gameIdSelector } from "../game/gameSlice";
import GameMapper from "../../games/GameMapper";
import { StepId } from "../../games/IGame";

export default function StrategiesSelector({ stepId }: { stepId: StepId }) {
  const dispatch = useAppDispatch();

  const gameId = useAppSelector(gameIdSelector);
  const step = useAppEntityIdSelectorNullable(templateStepSelectors, stepId);
  const template = useAppSelector(templateStepSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds);
  const playersTotal = useAppSelector(playersSelectors.selectTotal);

  const strategies = useMemo(
    () =>
      GameMapper.forId(gameId).at(stepId)!.strategies!({
        template,
        playersTotal,
      }),
    [gameId, playersTotal, stepId, template]
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
                      ? templateSlice.actions.disabled(
                          gameId,
                          stepId,
                          playersTotal
                        )
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
