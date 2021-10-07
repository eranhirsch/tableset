import { invariant_violation, Random } from "common";
import { Strategy } from "features/template/Strategy";
import { Skippable } from "model/Skippable";
import { VariableGameStep } from "model/VariableGameStep";
import { createGameStep } from "./createGameStep";
import { InstanceContext, TemplateContext } from "./createRandomGameStep";

interface Options {
  id: string;
  name: String;
  InstanceVariableComponent(): JSX.Element;
}

export interface VariantGameStep extends VariableGameStep<boolean>, Skippable {
  InstanceVariableComponent(props: { value: boolean }): JSX.Element;
  resolveRandom(context: InstanceContext): true | null;
  strategies(context: TemplateContext): readonly Strategy[];

  dependencies?: [...VariableGameStep<unknown>[]];

  TemplateFixedValueLabel: ((props: { value: true }) => JSX.Element) | string;
  initialFixedValue(context: InstanceContext): true;
}

export function createVariant({
  id,
  name,
  InstanceVariableComponent,
}: Options): VariantGameStep {
  const baseStep = createGameStep({
    id: `variant_${id}`,
    labelOverride: `Variant: ${name}`,
  });

  const extractInstanceValue = ({ instance }: InstanceContext) =>
    instance.some(({ id }) => id === baseStep.id);

  return {
    ...baseStep,
    extractInstanceValue,
    InstanceVariableComponent,

    skip: (context) => !extractInstanceValue(context),

    coerceInstanceEntry: (entry) =>
      entry == null
        ? false
        : typeof entry.value === "boolean"
        ? entry.value
        : invariant_violation(
            `Found unexpected value type ${typeof entry.value}: ${JSON.stringify(
              entry.value
            )} for variant ID ${id}`
          ),

    hasValue: (_: TemplateContext | InstanceContext) => true,

    resolveRandom: () => (Random.coin_flip(0.5) ? true : null),

    strategies: () => [Strategy.OFF, Strategy.RANDOM, Strategy.FIXED],

    TemplateFixedValueLabel: "Enabled",
    initialFixedValue: () => true,
  };
}
