import { nullthrows, type_invariant, Vec } from "common";
import { SetupStep } from "features/instance/instanceSlice";
import { Strategy } from "features/template/Strategy";
import { Templatable } from "features/template/Templatable";
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

export interface RandomGameStep<T = unknown>
  extends VariableGameStep<T>,
    Skippable,
    Templatable<T> {
  InstanceVariableComponent(props: { value: T }): JSX.Element;
  resolveRandom(context: InstanceContext): T;
  strategies(context: TemplateContext): readonly Strategy[];

  resolveDefault?(context: InstanceContext): T;
  TemplateFixedValueLabel?: ((props: { value: T }) => JSX.Element) | string;
  TemplateFixedValueSelector?(props: { current: T }): JSX.Element;
  initialFixedValue?(context: InstanceContext): T;
}

interface FixedOptions<
  T,
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
> {
  initializer(
    dependency1: D1,
    dependency2: D2,
    dependency3: D3,
    dependency4: D4,
    dependency5: D5,
    dependency6: D6,
    dependency7: D7,
    dependency8: D8,
    dependency9: D9,
    dependency10: D10
  ): T | undefined;
  renderTemplateLabel: ((props: { value: T }) => JSX.Element) | string;
  renderSelector?(props: { current: T }): JSX.Element;
}

type Options<
  T,
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

    random(
      dependency1: D1,
      dependency2: D2,
      dependency3: D3,
      dependency4: D4,
      dependency5: D5,
      dependency6: D6,
      dependency7: D7,
      dependency8: D8,
      dependency9: D9,
      dependency10: D10
    ): T;
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
    refresh(
      current: T,
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
    ): T | undefined;
    fixed?: FixedOptions<T, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>;
    skip?(
      value: T | null,
      dependencies: DepsTuple<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>
    ): boolean;
  };

interface FixedOptionsInternal<T>
  extends FixedOptions<
    T,
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
  initializer(...dependencies: unknown[]): T | undefined;
}

interface OptionsInternal<T>
  extends Options<
    T,
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
  random(...dependencies: unknown[]): T;
  isTemplatable(...queries: Query<unknown>[]): boolean;
  refresh(current: T, ...dependencies: Query<unknown>[]): T;
  fixed?: FixedOptionsInternal<T>;
}

export function createRandomGameStep<
  T,
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
  options: Options<T, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>
): Readonly<RandomGameStep<T>>;
export function createRandomGameStep<T>({
  dependencies,
  fixed,
  InstanceVariableComponent,
  isTemplatable,
  isType,
  random,
  refresh,
  skip,
  ...baseOptions
}: OptionsInternal<T>): Readonly<RandomGameStep<T>> {
  const baseStep = createGameStep(baseOptions);

  const extractInstanceValue = ({ instance }: InstanceContext) => {
    const step = instance.find(({ id }) => id === baseStep.id);
    return step == null
      ? null
      : type_invariant(
          step.value,
          nullthrows(
            isType,
            `Game step ${baseStep.id} does not have a type predicate defined`
          ),
          `Value ${step.value} couldn't be converted to the type defined by it's type ${baseStep.id}`
        );
  };

  const variableStep: RandomGameStep<T> = {
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

    skip: (context) =>
      skip != null
        ? skip(
            extractInstanceValue(context),
            dependencies != null
              ? dependenciesInstanceValues(context, dependencies)
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

    resolveRandom: (context) =>
      random(
        ...(dependencies?.map((dependency) =>
          nullthrows(
            dependency.extractInstanceValue!(context),
            `Unfulfilled dependency ${dependency.id} for ${baseStep.id}`
          )
        ) ?? [])
      ),

    strategies: (context) =>
      strategies(context, dependencies ?? [], fixed?.initializer),

    canBeTemplated: (template, context) =>
      isTemplatable(
        ...dependencies.map((dependency) => dependency.query(template, context))
      ),

    refreshFixedValue: (current, template, context) =>
      refresh(
        current,
        ...dependencies.map((dependency) => dependency.query(template, context))
      ),

    query: (template, _) =>
      buildQuery(baseStep.id, {
        canResolveTo(value: T) {
          const element = template[baseStep.id];
          return (
            element != null &&
            (element.strategy !== Strategy.FIXED || element.value === value)
          );
        },

        willResolve: () => template[baseStep.id] != null,
      }),
  };

  if (fixed != null) {
    variableStep.TemplateFixedValueLabel = fixed.renderTemplateLabel;
    variableStep.TemplateFixedValueSelector = fixed.renderSelector;
    variableStep.initialFixedValue = (context) =>
      nullthrows(
        fixed.initializer(
          ...(dependencies?.map((dependency) =>
            nullthrows(
              dependency.extractInstanceValue!(context),
              `Unfulfilled dependency ${dependency.id} for ${baseStep.id}`
            )
          ) ?? []),
          `Trying to derive the 'initial fixed' item when it shouldn't be allowed for id ${baseStep.id}`
        )
      );
  }

  return variableStep;
}

function strategies(
  context: TemplateContext,
  dependencies: readonly VariableGameStep<unknown>[],
  fixedInitializer?: (...dependencies: unknown[]) => unknown | undefined
) {
  const strategies = [];

  const fakeInstanceContext = { ...context, instance: [] };

  const fulfilledDependencies =
    dependencies != null
      ? Vec.map(dependencies, (dependency) =>
          dependency.extractInstanceValue!(fakeInstanceContext)
        )
      : [];
  const fixedValue =
    fixedInitializer != null
      ? fixedInitializer(...fulfilledDependencies)
      : undefined;
  if (fixedInitializer == null || fixedValue != null) {
    const areDependenciesFulfilled =
      dependencies?.every((dependency) => dependency.hasValue!(context)) ??
      true;
    if (areDependenciesFulfilled) {
      strategies.push(Strategy.RANDOM);
    }

    if (fixedValue != null) {
      strategies.push(Strategy.FIXED);
    }
  }

  if (strategies.length > 0) {
    // Only if we have other strategies do we add the OFF strategy, otherwise
    // we prefer returning an empty array instead of an array with just
    // Strategy.OFF, this will allow us in the future to reconsider how we
    // represent the OFF status.
    strategies.unshift(Strategy.OFF);
  }

  return strategies;
}
