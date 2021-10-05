import { Random } from "common";
import { createVariableGameStep } from "games/core/steps/createVariableGameStep";

interface VariantOptions {
  id: string;
  name: String;
  InstanceVariableComponent(): JSX.Element;
}

export const createVariant = ({
  id,
  name,
  InstanceVariableComponent,
}: VariantOptions) =>
  createVariableGameStep({
    id: `variant_${id}`,
    labelOverride: `Variant: ${name}`,

    isType: (value): value is true => value === true,

    // TODO: reimplment with new API for showStep
    // isOptional: true,

    random: () => (Random.coin_flip(0.5) ? true : null),
    InstanceVariableComponent,

    fixed: {
      initializer: (_) => true as true,
      renderTemplateLabel: "Enabled",
    },
  });
