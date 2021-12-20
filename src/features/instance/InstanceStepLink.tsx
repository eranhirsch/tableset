import { Link } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { gameStepSelector } from "features/game/gameSlice";
import { StepId } from "./Game";
import { GameStepBase } from "./GameStepBase";
import { useInstanceActiveSteps } from "./useInstanceActiveSteps";

export function InstanceStepLink(
  props: { step: GameStepBase } | { stepId: StepId }
): JSX.Element {
  const navigateToSibling = ReactUtils.useNavigateToSibling();
  const activeSteps = useInstanceActiveSteps();

  const stepId = "stepId" in props ? props.stepId : props.step.id;
  const stepIdx = activeSteps.findIndex(({ id }) => id === stepId);

  return (
    <Link onClick={() => navigateToSibling(stepId)}>
      Step {stepIdx + 1}: <StepLabel stepId={stepId} />
    </Link>
  );
}

function StepLabel({ stepId }: { stepId: StepId }): JSX.Element {
  const gameStep = useAppSelector(gameStepSelector(stepId));
  return <>{gameStep.label}</>;
}
