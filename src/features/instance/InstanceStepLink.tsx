import { Link } from "@mui/material";
import { StepLabel } from "features/game/StepLabel";
import { StepId } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { Link as RouterLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";

export function InstanceStepLink(
  props: { step: GameStepBase } | { stepId: StepId }
): JSX.Element {
  const game = useAppSelector(gameSelector);

  const stepId = "stepId" in props ? props.stepId : props.step.id;
  const stepIdx = game.steps.findIndex(({ id }) => id === stepId);

  return (
    <Link component={RouterLink} to={`#${stepId}`}>
      Step {stepIdx + 1}: <StepLabel stepId={stepId} />
    </Link>
  );
}
