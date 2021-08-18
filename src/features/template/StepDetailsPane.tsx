import { Collapse, Stack } from "@material-ui/core";
import React from "react";
import { useMemo } from "react";
import { selectors as templateStepSelectors } from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import StrategiesSelector from "./StrategiesSelector";
import FixedSettingsConfig from "./FixedSettingsConfig";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { SetupStepName } from "../../core/games/concordia/ConcordiaGame";

export default function StepDetailsPane({ stepId }: { stepId: SetupStepName }) {
  const step = useAppEntityIdSelectorNullable(templateStepSelectors, stepId);

  const strategyControls = useMemo(() => {
    if (step?.strategy === Strategy.FIXED) {
      return <FixedSettingsConfig stepId={stepId} />;
    }
    return null;
  }, [stepId, step]);

  return (
    <Stack sx={{ padding: 1 }} alignItems="center" spacing={1}>
      <Collapse in={strategyControls != null}>{strategyControls}</Collapse>
      <StrategiesSelector stepId={stepId} />
    </Stack>
  );
}
