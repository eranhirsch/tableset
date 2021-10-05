import { Link } from "@mui/material";
import { gameStepsSelector } from "features/game/gameSlice";
import { StepLabel } from "features/game/StepLabel";
import { StepId } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { Link as RouterLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export function InstanceStepLink(
  props: { step: GameStepBase } | { stepId: StepId }
): JSX.Element {
  const allSteps = useAppSelector(gameStepsSelector);

  const stepId = "stepId" in props ? props.stepId : props.step.id;
  const stepIdx = allSteps.findIndex(({ id }) => id === stepId);

  return (
    <Link component={RouterLink} to={`#${stepId}`}>
      Step {stepIdx + 1}: <StepLabel stepId={stepId} />
    </Link>
  );
}
