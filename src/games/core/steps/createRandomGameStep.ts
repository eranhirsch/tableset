import { nullthrows, type_invariant, Vec } from "common";
import { SetupStep } from "features/instance/instanceSlice";
import { Strategy } from "features/template/Strategy";
import { TemplateElement } from "features/template/templateSlice";
import { StepId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { ContextBase } from "../../../model/ContextBase";
import { createGameStep, CreateGameStepOptions } from "./createGameStep";

export interface VariableStepInstanceComponentProps<T> {
  value: T;
}

export interface TemplateContext extends ContextBase {
  template: Readonly<Record<StepId, Readonly<TemplateElement>>>;
}

export interface InstanceContext extends ContextBase {
  instance: readonly SetupStep[];
}

export interface RandomGameStep<T = unknown> extends VariableGameStep<T> {
  InstanceVariableComponent(props: { value: T }): JSX.Element;
  resolveRandom(context: InstanceContext): T;
  strategies(context: TemplateContext): readonly Strategy[];

  dependencies?: [...VariableGameStep<unknown>[]];
  isType?(value: unknown): value is T;
  resolveDefault?(context: InstanceContext): T;
  TemplateFixedValueLabel?: ((props: { value: T }) => JSX.Element) | string;
  TemplateFixedValueSelector?(props: { current: T }): JSX.Element;
  initialFixedValue?(context: InstanceContext): T;
  refreshFixedValue?(current: T, context: ContextBase): T | undefined;
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
  refresh?(current: T, context: ContextBase): T | undefined;
  renderTemplateLabel: ((props: { value: T }) => JSX.Element) | string;
  renderSelector?(props: { current: T }): JSX.Element;
}

interface Options<
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
> extends CreateGameStepOptions {
  dependencies?:
    | [VariableGameStep<D1>]
    | [VariableGameStep<D1>, VariableGameStep<D2>]
    | [VariableGameStep<D1>, VariableGameStep<D2>, VariableGameStep<D3>]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>,
        VariableGameStep<D8>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>,
        VariableGameStep<D8>,
        VariableGameStep<D9>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>,
        VariableGameStep<D8>,
        VariableGameStep<D9>,
        VariableGameStep<D10>
      ];

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
  recommended?(context: InstanceContext): T | undefined;
  fixed?: FixedOptions<T, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>;
}

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
  isType,
  InstanceVariableComponent,
  random,
  recommended,
  fixed,
  ...baseOptions
}: OptionsInternal<T>): Readonly<RandomGameStep<T>> {
  const baseStep = createGameStep(baseOptions);

  const hasValue = (context: TemplateContext | InstanceContext) =>
    "template" in context
      ? context.template[baseStep.id] != null
      : context.instance.some(({ id }) => id === baseStep.id);

  const extractInstanceValue = ({ instance }: InstanceContext) => {
    const step = instance.find((setupStep) => setupStep.id === baseStep.id);
    if (step == null) {
      return null;
    }
    return type_invariant(
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
    isType,
    dependencies,
    hasValue,
    extractInstanceValue,
    InstanceVariableComponent,

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
      strategies(context, dependencies ?? [], fixed?.initializer, recommended),
  };

  if (recommended != null) {
    variableStep.resolveDefault = (context) =>
      nullthrows(
        recommended(context),
        `Trying to derive the 'recommended' item when it shouldn't be allowed for id ${baseStep.id}`
      );
  }

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
    variableStep.refreshFixedValue = fixed.refresh;
  }

  return variableStep;
}

function strategies(
  context: TemplateContext,
  dependencies: readonly VariableGameStep<unknown>[],
  fixedInitializer?: (...dependencies: unknown[]) => unknown | undefined,
  recommended?: (context: InstanceContext) => unknown | undefined
) {
  const strategies = [];

  const fakeInstanceContext = { ...context, instance: [] };

  if (recommended != null) {
    // TODO: We use an empty instance here, this is problematic because it
    // doesn't allow us to catch cases where the instance is required to
    // calculate the recommended value (e.g. if it relies on the value of
    // a previous step)
    const value = recommended(fakeInstanceContext);
    if (value != null) {
      strategies.push(Strategy.DEFAULT);
    }
  }

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
      strategies.push(Strategy.FIXED, Strategy.ASK);
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