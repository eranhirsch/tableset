import { Link } from "@material-ui/core";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";
import IGameStep from "../../games/core/steps/IGameStep";
import { Link as RouterLink } from "react-router-dom";

export function InstanceStepLink({
  step,
}: {
  step: IGameStep<any>;
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  const stepIdx = game.steps.indexOf(step);

  return (
    <Link component={RouterLink} to={`#${step.id}`}>
      {stepIdx + 1}: {step.label}
    </Link>
  );
}
