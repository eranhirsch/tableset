import { invariant_violation } from "common";
import { Strategy } from "features/template/Strategy";
import { TemplateElement } from "features/template/templateSlice";
import IGameStep, { InstanceContext } from "games/core/steps/IGameStep";

export function templateElementResolver<T>(
  gameStep: IGameStep<T>,
  element: TemplateElement,
  context: InstanceContext
): T {
  switch (element.strategy) {
    case Strategy.RANDOM:
      if (gameStep.resolveRandom == null) {
        invariant_violation(
          `Element ${JSON.stringify(element)} does not have a random resolver`
        );
      }
      return gameStep.resolveRandom(context);

    case Strategy.DEFAULT:
      if (gameStep.resolveDefault == null) {
        invariant_violation(
          `Element ${JSON.stringify(element)} does not have a default resolver`
        );
      }
      return gameStep.resolveDefault(context);

    case Strategy.FIXED:
      // Just copy the value
      return element.value as any;
  }

  invariant_violation(
    `Element ${JSON.stringify(
      element
    )} is using a strategy that isn't supported`
  );
}
