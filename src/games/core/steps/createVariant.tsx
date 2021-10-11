import { invariant_violation, Random } from "common";
import { Strategy } from "features/template/Strategy";
import { Templatable } from "features/template/Templatable";
import { Skippable } from "model/Skippable";
import { VariableGameStep } from "model/VariableGameStep";
import { createGameStep } from "./createGameStep";
import { InstanceContext, TemplateContext } from "./createRandomGameStep";
import { buildQuery, Query } from "./Query";
import { StepWithDependencies } from "./StepWithDependencies";

interface Options<
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never,
  D10 = never
> extends StepWithDependencies<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> {
  id: string;
  name: String;
  isTemplatable(
    query1: Query<D1>,
    query2: Query<D2>,
    query3: Query<D3>,
    query4: Query<D4>,
    query5: Query<D5>,
    query6: Query<D6>,
    query7: Query<D7>,
    query8: Query<D8>,
    query9: Query<D9>,
    query10: Query<D10>
  ): boolean;
  InstanceVariableComponent(): JSX.Element;
}

interface OptionsInternal
  extends Options<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  > {
  isTemplatable(...queries: Query<unknown>[]): boolean;
}

export interface VariantGameStep
  extends VariableGameStep<boolean>,
    Skippable,
    Templatable {
  InstanceVariableComponent(props: { value: boolean }): JSX.Element;
  resolveRandom(context: InstanceContext): true | null;
  strategies(context: TemplateContext): readonly Strategy[];

  dependencies: [...VariableGameStep<unknown>[]];

  TemplateFixedValueLabel: ((props: { value: true }) => JSX.Element) | string;
  initialFixedValue(context: InstanceContext): true;
}

export function createVariant<
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never,
  D10 = never
>(options: Options<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>): VariantGameStep;
export function createVariant({
  id,
  name,
  dependencies,
  isTemplatable,
  InstanceVariableComponent,
}: OptionsInternal): VariantGameStep {
  const baseStep = createGameStep({
    id: `variant_${id}`,
    labelOverride: `Variant: ${name}`,
  });

  const extractInstanceValue = ({ instance }: InstanceContext) =>
    instance.some(({ id }) => id === baseStep.id);

  return {
    ...baseStep,

    dependencies,

    extractInstanceValue,
    InstanceVariableComponent,

    skip: (context) => !extractInstanceValue(context),

    canBeTemplated: (template, context) =>
      isTemplatable(
        ...dependencies.map((dependency) => dependency.query(template, context))
      ),

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

    strategies: (context) =>
      dependencies == null ||
      dependencies.every((dependency) => dependency.hasValue!(context))
        ? [Strategy.OFF, Strategy.RANDOM, Strategy.FIXED]
        : [],

    TemplateFixedValueLabel: "Enabled",
    initialFixedValue: () => true,

    query: (template) =>
      buildQuery(baseStep.id, {
        canResolveTo: (value: boolean) =>
          value === (template[baseStep.id] != null),
        willResolve: () => template[baseStep.id] != null,
      }),
  };
}
