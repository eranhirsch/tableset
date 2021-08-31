import { Collapse, Stack } from "@material-ui/core";
import { useMemo } from "react";
import { selectors as templateStepSelectors } from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import StrategiesSelector from "./StrategiesSelector";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { StepId } from "../../games/IGame";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";

export default function StepDetailsPane({ stepId }: { stepId: StepId }) {
  const game = useAppSelector(gameSelector);
  const step = useAppEntityIdSelectorNullable(templateStepSelectors, stepId);

  const strategyControls = useMemo(() => {
    if (step?.strategy === Strategy.FIXED) {
      return game.at(stepId)!.renderTemplateFixedValueSelector!();
    }
    return null;
  }, [step?.strategy, game, stepId]);

  return (
    <Stack sx={{ padding: 1 }} alignItems="center" spacing={1}>
      <Collapse in={strategyControls != null}>{strategyControls}</Collapse>
      <StrategiesSelector stepId={stepId} />
    </Stack>
  );
}
