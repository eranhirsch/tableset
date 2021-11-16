import { useAppSelector } from "app/hooks";
import { isRandomGameStep } from "games/core/steps/createRandomGameStep";
import { StepId } from "model/Game";
import { gameStepSelector } from "./gameSlice";

export function StepLabel({ stepId }: { stepId: StepId }): JSX.Element {
  const gameStep = useAppSelector(gameStepSelector(stepId));
  return (
    <>
      {isRandomGameStep(gameStep) && gameStep.isVariant && "Variant: "}
      {gameStep.label}
    </>
  );
}
