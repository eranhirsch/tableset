import { Collapse, Stack } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { gameStepSelector } from "features/game/gameSlice";
import { Strategy } from "features/template/Strategy";
import { RandomGameStep } from "games/core/steps/createVariableGameStep";
import { StepId } from "model/Game";
import { useMemo } from "react";
import { StrategiesSelector } from "./StrategiesSelector";
import { templateSelectors } from "./templateSlice";

export default function StepDetailsPane({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element {
  const gameStep = useAppSelector(gameStepSelector(stepId)) as RandomGameStep;
  const templateElement = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  const strategyControls = useMemo(() => {
    if (templateElement == null) {
      return null;
    }

    if (templateElement.strategy !== Strategy.FIXED) {
      return null;
    }

    if (gameStep.TemplateFixedValueSelector == null) {
      return null;
    }

    return (
      <gameStep.TemplateFixedValueSelector current={templateElement.value} />
    );
  }, [gameStep, templateElement]);

  return (
    <Stack sx={{ padding: 1 }} alignItems="center" spacing={1}>
      <Collapse in={strategyControls != null}>{strategyControls}</Collapse>
      <StrategiesSelector stepId={stepId} />
    </Stack>
  );
}
