import { Link } from "@mui/material";
import { StepLabel } from "features/game/StepLabel";
import { StepId } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { Link as RouterLink } from "react-router-dom";
import { useInstanceActiveSteps } from "./useInstanceActiveSteps";

export function InstanceStepLink(
  props: { step: GameStepBase } | { stepId: StepId }
): JSX.Element {
  const activeSteps = useInstanceActiveSteps();

  const stepId = "stepId" in props ? props.stepId : props.step.id;
  const stepIdx = activeSteps.findIndex(({ id }) => id === stepId);

  return (
    <Link component={RouterLink} to={`#${stepId}`}>
      Step {stepIdx + 1}: <StepLabel stepId={stepId} />
    </Link>
  );
}
