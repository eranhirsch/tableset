import { Link } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";
import IGameStep from "../../games/core/steps/IGameStep";
import { Link as RouterLink } from "react-router-dom";
import { StepId } from "games/core/IGame";

export function InstanceStepLink({
  step,
}: {
  step: IGameStep<any> | StepId;
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  if (typeof step === "string") {
    step = game.atEnforce(step);
  }
  const stepIdx = game.steps.indexOf(step);

  return (
    <Link component={RouterLink} to={`#${step.id}`}>
      Step {stepIdx + 1}: {step.label}
    </Link>
  );
}
