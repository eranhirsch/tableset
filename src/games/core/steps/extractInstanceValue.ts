import { type_invariant } from "../../../common/err/invariant";
import nullthrows from "../../../common/err/nullthrows";
import { SetupStep } from "../../../features/instance/instanceSlice";
import IGameStep from "./IGameStep";

export default function extractInstanceValue<T>(
  gameStep: IGameStep<T>,
  instance: readonly SetupStep[]
): T {
  const step = nullthrows(
    instance.find((setupStep) => setupStep.id === gameStep.id),
    `Step ${gameStep.id} is missing from instance`
  );

  return type_invariant(
    step.value,
    nullthrows(
      gameStep.isType,
      `Game step ${gameStep.id} does not have a type predicate defined`
    ),
    `Value ${step.value} couldn't be converted to the type defined by it's type ${gameStep.id}`
  );
}
