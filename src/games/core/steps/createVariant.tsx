import { Dict, invariant_violation, Random, Vec } from "common";
import { Templatable } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { Skippable } from "model/Skippable";
import { VariableGameStep } from "model/VariableGameStep";
import { createGameStep } from "./createGameStep";
import { InstanceContext, TemplateContext } from "./createRandomGameStep";
import { OptionsWithDependencies } from "./OptionsWithDependencies";
import { buildQuery, Query } from "./Query";

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
> extends OptionsWithDependencies<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> {
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
  isTemplatable(...queries: Query[]): boolean;
}

export interface VariantGameStep
  extends VariableGameStep<boolean>,
    Skippable,
    Templatable<true, number> {
  InstanceVariableComponent(props: { value: boolean }): JSX.Element;
  resolveRandom(context: InstanceContext): true | null;

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
  InstanceVariableComponent,
  isTemplatable,
}: OptionsInternal): VariantGameStep {
  const baseStep = createGameStep({
    id: `variant_${id}`,
    labelOverride: `Variant: ${name}`,
  });

  const extractInstanceValue: VariantGameStep["extractInstanceValue"] = (
    instance
  ) => (instance[baseStep.id] != null ? true : null);

  return {
    ...baseStep,

    dependencies,

    extractInstanceValue,
    InstanceVariableComponent,

    skip: ({ instance, ...context }) =>
      !extractInstanceValue(
        Dict.from_values(instance, ({ id }) => id),
        context
      ),

    canBeTemplated: (template, context) =>
      isTemplatable(
        ...Vec.map(dependencies, (dependency) =>
          dependency.query(template, context)
        )
      ),
    // The value can never be changed following changes in the template, it
    // could only be disabled via `canBeTemplated`
    refreshTemplateConfig: () => templateValue("unchanged"),
    initialConfig: () => 0.5,
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
    resolve: () => (Random.coin_flip(0.5) ? true : null),

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
