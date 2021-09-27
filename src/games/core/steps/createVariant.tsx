import { Random } from "common";
import { createVariableGameStep } from "games/core/steps/createVariableGameStep";
import IGameStep from "games/core/steps/IGameStep";

export function createVariant({
  id,
  name,
  InstanceVariableComponent,
}: {
  id: string;
  name: String;
  InstanceVariableComponent: () => JSX.Element;
}): IGameStep<true | null> {
  return createVariableGameStep({
    id: `variant_${id}`,
    labelOverride: `Variant: ${name}`,

    isType: (value): value is true => value === true,

    isOptional: true,

    random: () => (Random.coin_flip(0.5) ? true : null),
    InstanceVariableComponent,

    fixed: {
      initializer: (_) => true as true,
      renderTemplateLabel: "Enabled",
    },
  });
}
