import { invariant_violation } from "common";
import { Strategy } from "features/template/Strategy";
import { TemplateElement } from "features/template/templateSlice";
import {
  InstanceContext,
  RandomGameStep,
} from "games/core/steps/createRandomGameStep";

export function templateElementResolver<T>(
  gameStep: RandomGameStep<T>,
  element: TemplateElement,
  context: InstanceContext
): T {
  switch (element.strategy) {
    case Strategy.RANDOM:
      return gameStep.resolveRandom(context);

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
