import { Link } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { gameStepSelector } from "features/game/gameSlice";
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

function StepLabel({ stepId }: { stepId: StepId }): JSX.Element {
  const gameStep = useAppSelector(gameStepSelector(stepId));
  return <>{gameStep.label}</>;
}
