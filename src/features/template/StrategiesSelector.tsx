import { Chip, Stack } from "@material-ui/core";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import templateSlice, { templateSelectors } from "./templateSlice";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import Strategy from "../../core/Strategy";
import { PlayerId, playersSelectors } from "../players/playersSlice";
import { gameIdSelector } from "../game/gameSlice";
import GameMapper from "../../games/core/GameMapper";
import { StepId } from "../../games/core/IGame";

export default function StrategiesSelector({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const gameId = useAppSelector(gameIdSelector);
  const step = useAppEntityIdSelectorNullable(templateSelectors, stepId);
  const template = useAppSelector(templateSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const strategies = useMemo(
    () =>
      GameMapper.forId(gameId).at(stepId)!.strategies!({
        template,
        playerIds,
      }),
    [gameId, playerIds, stepId, template]
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
                          playerIds as PlayerId[]
                        )
                      : strategy === Strategy.OFF
                      ? templateSlice.actions.disabled(stepId)
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
