import { Collapse, Stack } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { Strategy } from "features/template/Strategy";
import { StepId } from "model/IGame";
import { useMemo } from "react";
import { gameSelector } from "../game/gameSlice";
import { StrategiesSelector } from "./StrategiesSelector";
import { templateSelectors } from "./templateSlice";

export default function StepDetailsPane({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  const step = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  const strategyControls = useMemo(() => {
    if (step == null) {
      return null;
    }

    if (step.strategy !== Strategy.FIXED) {
      return null;
    }

    const { TemplateFixedValueSelector } = game.atEnforce(stepId);
    if (TemplateFixedValueSelector == null) {
      return null;
    }

    return <TemplateFixedValueSelector current={step.value} />;
  }, [game, step, stepId]);

  return (
    <Stack sx={{ padding: 1 }} alignItems="center" spacing={1}>
      <Collapse in={strategyControls != null}>{strategyControls}</Collapse>
      <StrategiesSelector stepId={stepId} />
    </Stack>
  );
}
