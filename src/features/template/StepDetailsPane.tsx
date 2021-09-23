import { Collapse, Stack } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { nullthrows, ReactUtils } from "common";
import { Strategy } from "features/template/Strategy";
import { StepId } from "games/core/IGame";
import { useMemo } from "react";
import { gameSelector } from "../game/gameSlice";
import StrategiesSelector from "./StrategiesSelector";
import { templateSelectors } from "./templateSlice";

export default function StepDetailsPane({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element | null {
  const game = useAppSelector(gameSelector);
  const step = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  const strategyControls = useMemo(() => {
    if (step != null && step.strategy === Strategy.FIXED) {
      const TemplateFixedValueSelector = nullthrows(
        game.atEnforce(stepId).TemplateFixedValueSelector,
        `No selector component defined for step ${stepId}`
      );
      return <TemplateFixedValueSelector current={step.value} />;
    }
    return null;
  }, [game, step, stepId]);

  return (
    <Stack sx={{ padding: 1 }} alignItems="center" spacing={1}>
      <Collapse in={strategyControls != null}>{strategyControls}</Collapse>
      <StrategiesSelector stepId={stepId} />
    </Stack>
  );
}
