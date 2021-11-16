import { useAppSelector } from "app/hooks";
import { StepId } from "model/Game";
import { gameStepSelector } from "./gameSlice";

export function StepLabel({ stepId }: { stepId: StepId }): JSX.Element {
  const gameStep = useAppSelector(gameStepSelector(stepId));
  return <>{gameStep.label}</>;
}
