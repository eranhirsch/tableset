import { Collapse, Stack } from "@material-ui/core";
import { useMemo } from "react";
import { templateSelectors } from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import StrategiesSelector from "./StrategiesSelector";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";
import { StepId } from "../../games/core/IGame";

export default function StepDetailsPane({ stepId }: { stepId: StepId }) {
  const game = useAppSelector(gameSelector);
  const step = useAppEntityIdSelectorNullable(templateSelectors, stepId);

  const strategyControls = useMemo(() => {
    if (step != null && step.strategy === Strategy.FIXED) {
      return game.at(stepId)!.renderTemplateFixedValueSelector!(step.value);
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
