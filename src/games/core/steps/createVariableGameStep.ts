import { nullthrows, type_invariant } from "common";
import { PlayerId } from "model/Player";
import { Strategy } from "features/template/Strategy";
import createGameStep, { CreateGameStepOptions } from "./createGameStep";
import IGameStep, { InstanceContext } from "./IGameStep";

export interface VariableStepInstanceComponentProps<T> {
  value: T;
}

interface CreateVariableGameStepOptionsAny<T> extends CreateGameStepOptions {
  dependencies?: [IGameStep<any>, ...IGameStep<any>[]];

  isType?(value: any): value is T;

  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<T>
  ): JSX.Element;

  random(...dependencies: any[]): T;

  recommended?(context: InstanceContext): T | undefined;

  fixed?: {
    initializer(playerIds: readonly PlayerId[]): T | undefined;
    refresh?(current: T, playerIds: readonly string[]): T | undefined;

    renderTemplateLabel: ((props: { value: T }) => JSX.Element) | string;
    renderSelector?(props: { current: T }): JSX.Element;
  };
}

interface CreateVariableGameStepOptions<
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
    | [IGameStep<D1>]
    | [IGameStep<D1>, IGameStep<D2>]
    | [IGameStep<D1>, IGameStep<D2>, IGameStep<D3>]
    | [IGameStep<D1>, IGameStep<D2>, IGameStep<D3>, IGameStep<D4>]
    | [
        IGameStep<D1>,
        IGameStep<D2>,
        IGameStep<D3>,
        IGameStep<D4>,
        IGameStep<D5>
      ]
    | [
        IGameStep<D1>,
        IGameStep<D2>,
        IGameStep<D3>,
        IGameStep<D4>,
        IGameStep<D5>,
        IGameStep<D6>
      ]
    | [
        IGameStep<D1>,
        IGameStep<D2>,
        IGameStep<D3>,
        IGameStep<D4>,
        IGameStep<D5>,
        IGameStep<D6>,
        IGameStep<D7>
      ]
    | [
        IGameStep<D1>,
        IGameStep<D2>,
        IGameStep<D3>,
        IGameStep<D4>,
        IGameStep<D5>,
        IGameStep<D6>,
        IGameStep<D7>,
        IGameStep<D8>
      ]
    | [
        IGameStep<D1>,
        IGameStep<D2>,
        IGameStep<D3>,
        IGameStep<D4>,
        IGameStep<D5>,
        IGameStep<D6>,
        IGameStep<D7>,
        IGameStep<D8>,
        IGameStep<D9>
      ]
    | [
        IGameStep<D1>,
        IGameStep<D2>,
        IGameStep<D3>,
        IGameStep<D4>,
        IGameStep<D5>,
        IGameStep<D6>,
        IGameStep<D7>,
        IGameStep<D8>,
        IGameStep<D9>,
        IGameStep<D10>
      ];

  isType?(value: any): value is T;

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
  fixed?: {
    initializer(playerIds: readonly PlayerId[]): T | undefined;
    refresh?(current: T, playerIds: readonly string[]): T | undefined;
    renderTemplateLabel: ((props: { value: T }) => JSX.Element) | string;
    renderSelector?(props: { current: T }): JSX.Element;
  };
}

export function createVariableGameStep<
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
  options: CreateVariableGameStepOptions<
    T,
    D1,
    D2,
    D3,
    D4,
    D5,
    D6,
    D7,
    D8,
    D9,
    D10
  >
): IGameStep<T>;
export function createVariableGameStep<T>({
  dependencies,
  isType,
  InstanceVariableComponent,
  random,
  recommended,
  fixed,
  ...baseOptions
}: CreateVariableGameStepOptionsAny<T>): IGameStep<T> {
  const gameStep: IGameStep<T> = createGameStep(baseOptions);

  gameStep.dependencies = dependencies;

  gameStep.hasValue = (context) =>
    "template" in context
      ? context.template[gameStep.id] != null
      : context.instance.some(({ id }) => id === gameStep.id);

  gameStep.extractInstanceValue = ({ instance }) => {
    const step = instance.find((setupStep) => setupStep.id === gameStep.id);
    if (step == null) {
      return null;
    }
    return type_invariant(
      step.value,
      nullthrows(
        isType,
        `Game step ${gameStep.id} does not have a type predicate defined`
      ),
      `Value ${step.value} couldn't be converted to the type defined by it's type ${gameStep.id}`
    );
  };

  gameStep.isType = isType;

  gameStep.InstanceVariableComponent = InstanceVariableComponent;

  gameStep.resolveRandom = (context) =>
    random(
      ...(dependencies?.map((dependency) =>
        nullthrows(
          dependency.extractInstanceValue!(context),
          `Unfulfilled dependency ${dependency.id} for ${gameStep.id}`
        )
      ) ?? [])
    );

  if (recommended != null) {
    gameStep.resolveDefault = (context) =>
      nullthrows(
        recommended(context),
        `Trying to derive the 'recommended' item when it shouldn't be allowed for id ${gameStep.id}`
      );
  }

  if (fixed != null) {
    gameStep.TemplateFixedValueLabel = fixed.renderTemplateLabel;
    gameStep.TemplateFixedValueSelector = fixed.renderSelector;
    gameStep.initialFixedValue = (playerIds) =>
      nullthrows(
        fixed.initializer(playerIds),
        `Trying to derive the 'initial fixed' item when it shouldn't be allowed for id ${gameStep.id}`
      );
    gameStep.refreshFixedValue = fixed.refresh;
  }

  gameStep.strategies = (context) => {
    const strategies = [];

    if (recommended != null) {
      // TODO: We use an empty instance here, this is problematic because it
      // doesn't allow us to catch cases where the instance is required to
      // calculate the recommended value (e.g. if it relies on the value of
      // a previous step)
      const value = recommended({ playerIds: context.playerIds, instance: [] });
      if (value != null) {
        strategies.push(Strategy.DEFAULT);
      }
    }

    const fixedValue =
      fixed != null ? fixed.initializer(context.playerIds) : undefined;
    if (fixed == null || fixedValue != null) {
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
  };

  return gameStep;
}
