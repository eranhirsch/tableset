import { Random } from "common";
import { createRandomGameStep } from "games/core/steps/createRandomGameStep";

interface Options {
  id: string;
  name: String;
  InstanceVariableComponent(): JSX.Element;
}

export const createVariant = ({ id, name, InstanceVariableComponent }: Options) =>
  createRandomGameStep({
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

    skip: (isEnabled) => isEnabled == null,
  });
