import { Chip, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { PlayerId } from "model/Player";
import { Strategy } from "features/template/Strategy";
import { strategyLabel } from "features/template/strategyLabel";
import GameMapper from "games/core/GameMapper";
import { StepId } from "games/core/IGame";
import { useMemo } from "react";
import { gameIdSelector } from "../game/gameSlice";
import { playersSelectors } from "../players/playersSlice";
import { templateActions, templateSelectors } from "./templateSlice";

export default function StrategiesSelector({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const gameId = useAppSelector(gameIdSelector);
  const step = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );
  const template = useAppSelector(templateSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const strategies = useMemo(
    () =>
      GameMapper.forId(gameId).atEnforce(stepId).strategies!({
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
                  )
              : undefined
          }
        />
      ))}
    </Stack>
  );
}
