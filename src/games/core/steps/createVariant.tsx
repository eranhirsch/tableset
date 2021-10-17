import { Box, Slider } from "@mui/material";
import { Dict, invariant_violation, Random, type_invariant, Vec } from "common";
import { ConfigPanelProps, Templatable } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { Skippable } from "model/Skippable";
import { VariableGameStep } from "model/VariableGameStep";
import { useEffect } from "react";
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

type TemplateConfig = { percent: number };

export interface VariantGameStep
  extends VariableGameStep<boolean>,
    Skippable,
    Templatable<true, TemplateConfig> {
  InstanceVariableComponent(props: { value: boolean }): JSX.Element;
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
    initialConfig: () => ({ percent: 50 }),
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

    resolve: (config) => (Random.coin_flip(config.percent / 100) ? true : null),

    query: (template) =>
      buildQuery(baseStep.id, {
        canResolveTo: (value: boolean) =>
          value === (template[baseStep.id] != null),
        willResolve: () => template[baseStep.id] != null,
      }),

    ConfigPanel,
    ConfigPanelTLDR,
  };
}

function ConfigPanel<D0, D1, D2, D3, D4, D5, D6, D7, D8, D9>({
  config,
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  D0,
  D1,
  D2,
  D3,
  D4,
  D5,
  D6,
  D7,
  D8,
  D9
>): JSX.Element {
  useEffect(() => {
    if (config?.percent === 0) {
      onChange({ percent: 5 });
    }
  }, [config?.percent, onChange]);

  return (
    <Box textAlign="center">
      <Slider
        sx={{ width: "75%" }}
        disabled={config?.percent === 0}
        value={config?.percent ?? 0}
        min={0}
        max={100}
        step={5}
        marks={[{ value: 50, label: "\u25B2" }]}
        valueLabelDisplay="auto"
        valueLabelFormat={(percent) => `${percent}%`}
        onChange={(_, newValue) =>
          newValue !== config?.percent
            ? onChange({
                percent: type_invariant(newValue, isNumber),
              })
            : undefined
        }
      />
    </Box>
  );
}

function ConfigPanelTLDR({
  config: { percent },
}: {
  config: TemplateConfig;
}): JSX.Element {
  return percent === 100 ? <>Always</> : <em>{percent}% chance</em>;
}

const isNumber = (x: unknown): x is number => typeof x === "number";
