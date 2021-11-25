import { Box } from "@mui/material";
import { coerce, Dict, invariant_violation, Random, Vec } from "common";
import { templateValue } from "features/template/templateSlice";
import { PercentSlider } from "../ux/PercentSlider";
import { createGameStep } from "./createGameStep";
import {
  ConfigPanelProps,
  InstanceContext,
  RandomGameStep,
  TemplateContext,
} from "./createRandomGameStep";
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
  name: string;
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

type VariantGameStep = RandomGameStep<boolean, TemplateConfig>;

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
    labelOverride: name,
  });

  const extractInstanceValue: VariantGameStep["extractInstanceValue"] = (
    instance
  ) => (instance[baseStep.id] != null ? true : null);

  return {
    ...baseStep,

    isVariant: true,

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
    initialConfig: () => ({ percent: 100 }),
    coerceInstanceEntry: (entry) =>
      entry == null
        ? false
        : coerce(
            entry.value,
            isBoolean,
            `Found unexpected value type ${typeof entry.value}: ${JSON.stringify(
              entry.value
            )} for variant ID ${id}`
          ),

    hasValue: (_: TemplateContext | InstanceContext) => true,

    resolve: (config) => (Random.coin_flip(config.percent / 100) ? true : null),

    query: (template) =>
      buildQuery(baseStep.id, {
        canResolveTo(value: boolean) {
          const element = template[baseStep.id];
          const percent =
            element != null ? (element.config as TemplateConfig).percent : 0;
          // a variant can resolve to false if the percent is lower than 100
          // it can resolve to true if the percent is greater than 0
          return value ? percent > 0 : percent < 100;
        },

        onlyResolvableValue() {
          const element = template[baseStep.id];
          if (element == null) {
            return false;
          }

          const { percent } = element.config as TemplateConfig;
          return percent === 100 ? true : percent === 0 ? false : undefined;
        },
      }),

    ConfigPanel,
    ConfigPanelTLDR,

    InstanceCards: () =>
      invariant_violation(
        `Variant ${baseStep.id} should not be displayed as a card!`
      ),

    disabledTLDROverride: "Never",

    instanceAvroType: "boolean",
  };
}

function ConfigPanel<D0, D1, D2, D3, D4, D5, D6, D7, D8, D9>({
  config: { percent },
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
  return (
    <Box textAlign="center" paddingX={2}>
      <PercentSlider
        percent={percent}
        onChange={(percent) => onChange({ percent })}
        preventZero
      />
    </Box>
  );
}

function ConfigPanelTLDR({
  config: { percent },
}: {
  config: TemplateConfig;
}): JSX.Element {
  return percent === 100 ? <>Always</> : <>{percent}% chance</>;
}

const isBoolean = (x: unknown): x is boolean => typeof x === "boolean";
