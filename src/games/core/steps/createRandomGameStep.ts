import { Dict, nullthrows, type_invariant, Vec } from "common";
import { SetupStep } from "features/instance/instanceSlice";
import { ConfigPanelProps, Templatable } from "features/template/Templatable";
import { TemplateElement } from "features/template/templateSlice";
import { StepId } from "model/Game";
import { Skippable } from "model/Skippable";
import { VariableGameStep } from "model/VariableGameStep";
import { ContextBase } from "../../../model/ContextBase";
import { createGameStep, CreateGameStepOptions } from "./createGameStep";
import { dependenciesInstanceValues } from "./dependenciesInstanceValues";
import { DepsTuple } from "./DepsTuple";
import { OptionsWithDependencies } from "./OptionsWithDependencies";
import { buildQuery, Query } from "./Query";

export interface VariableStepInstanceComponentProps<T> {
  value: T;
}

export interface TemplateContext extends ContextBase {
  template: Readonly<Record<StepId, Readonly<TemplateElement>>>;
}

export interface InstanceContext extends ContextBase {
  instance: readonly SetupStep[];
}

export interface RandomGameStep<T = unknown, C = unknown>
  extends VariableGameStep<T>,
    Skippable,
    Templatable<T, C> {
  InstanceVariableComponent(props: { value: T }): JSX.Element;

  TemplateFixedValueLabel?: ((props: { value: T }) => JSX.Element) | string;
}

type Options<
  T,
  C,
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
> = CreateGameStepOptions &
  OptionsWithDependencies<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> & {
    isType?(value: unknown): value is T;

    InstanceVariableComponent(
      props: VariableStepInstanceComponentProps<T>
    ): JSX.Element;

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
    resolve(
      config: C,
      dependency1: D1 | null,
      dependency2: D2 | null,
      dependency3: D3 | null,
      dependency4: D4 | null,
      dependency5: D5 | null,
      dependency6: D6 | null,
      dependency7: D7 | null,
      dependency8: D8 | null,
      dependency9: D9 | null,
      dependency10: D10 | null
    ): T | null;
    refresh(
      current: C,
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
    ): C;
    canResolveTo?(
      value: T,
      config: C | null,
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
    initialConfig(
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
    ): C;
    skip?(
      value: T | null,
      dependencies: DepsTuple<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>
    ): boolean;
    ConfigPanel(
      props: ConfigPanelProps<C, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>
    ): JSX.Element;
    ConfigPanelTLDR(props: { config: C }): JSX.Element;
    disabledTLDROverride?: string;
  };

interface OptionsInternal<T, C>
  extends Options<
    T,
    C,
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
  resolve(config: C, ...dependencies: (unknown | null)[]): T | null;
  refresh(current: C, ...dependencies: Query[]): C;
  initialConfig(...queries: Query[]): C;
  canResolveTo?(value: T, config: unknown | null, ...queries: Query[]): boolean;
  ConfigPanel(props: {
    config: Readonly<C> | null;
    queries: readonly Query[];
    onChange(
      newConfig:
        | Readonly<C>
        | ((currentConfig: Readonly<C> | undefined) => Readonly<C>)
    ): void;
  }): JSX.Element;
}

export function createRandomGameStep<
  T,
  C,
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
>(
  options: Options<T, C, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>
): Readonly<RandomGameStep<T, C>>;
export function createRandomGameStep<T, C>({
  canResolveTo,
  ConfigPanel,
  ConfigPanelTLDR,
  dependencies,
  disabledTLDROverride,
  initialConfig,
  InstanceVariableComponent,
  isTemplatable,
  isType,
  refresh,
  resolve,
  skip,
  ...baseOptions
}: OptionsInternal<T, C>): Readonly<RandomGameStep<T, C>> {
  const baseStep = createGameStep(baseOptions);

  const extractInstanceValue: VariableGameStep<T>["extractInstanceValue"] = (
    instance
  ) => (instance[baseStep.id]?.value as T) ?? null;

  const variableStep: RandomGameStep<T, C> = {
    ...baseStep,

    coerceInstanceEntry: (entry) =>
      entry == null
        ? null
        : type_invariant(
            entry.value,
            nullthrows(
              isType,
              `No type coercer defined for step ${baseStep.id}`
            ),
            `Value ${JSON.stringify(
              entry.value
            )} failed to validate type for step ${baseStep.id}`
          ),

    dependencies,
    extractInstanceValue,
    InstanceVariableComponent,

    skip: ({ instance, ...context }) =>
      skip != null
        ? skip(
            extractInstanceValue(
              Dict.from_values(instance, ({ id }) => id),
              context
            ),
            dependencies != null
              ? dependenciesInstanceValues(
                  { instance, ...context },
                  dependencies
                )
              : [
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                ]
          )
        : false,

    hasValue: (context: TemplateContext | InstanceContext) =>
      "template" in context
        ? context.template[baseStep.id] != null
        : context.instance.some(({ id }) => id === baseStep.id),

    canBeTemplated: (template, context) =>
      isTemplatable(
        ...Vec.map(dependencies, (dependency) =>
          dependency.query(template, context)
        )
      ),

    refreshTemplateConfig: (current, template, context) =>
      refresh(
        current,
        ...Vec.map(dependencies, (dependency) =>
          dependency.query(template, context)
        )
      ),

    initialConfig: (template, context) =>
      initialConfig(
        ...Vec.map(dependencies, (dependency) =>
          dependency.query(template, context)
        )
      ),

    resolve: (config, upstreamInstance, context) =>
      resolve(
        config,
        ...Vec.map(dependencies, (dependency) =>
          dependency.extractInstanceValue(upstreamInstance, context)
        )
      ),

    query: (template, context) =>
      buildQuery(baseStep.id, {
        canResolveTo:
          canResolveTo == null
            ? undefined
            : (value) =>
                canResolveTo(
                  value,
                  template[baseStep.id]?.config,
                  ...Vec.map(dependencies, (dependency) =>
                    dependency.query(template, context)
                  )
                ),
        willResolve: () => template[baseStep.id] != null,
      }),

    ConfigPanel,
    ConfigPanelTLDR,
    disabledTLDROverride,
  };

  return variableStep;
}
