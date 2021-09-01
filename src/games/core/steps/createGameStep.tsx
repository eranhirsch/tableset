import { type_invariant } from "../../../common/err/invariant";
import invariant_violation from "../../../common/err/invariant_violation";
import nullthrows from "../../../common/err/nullthrows";
import { Strategy } from "../../../core/Strategy";
import { SetupStep } from "../../../features/instance/instanceSlice";
import { PlayerId } from "../../../features/players/playersSlice";
import { ConstantTemplateElement } from "../../../features/template/templateSlice";
import { StepId } from "../IGame";
import IGameStep, { InstanceContext } from "./IGameStep";

export interface CreateGameStepDeriversOptions0<T> {
  isType(value: any): value is T;
  renderInstanceItem(item: T): JSX.Element;
  random(context: InstanceContext): T | undefined;
  recommended?(context: InstanceContext): T | undefined;
  fixed?: {
    initializer(
      playerIds: readonly PlayerId[]
    ): ConstantTemplateElement | undefined;
    renderTemplateLabel(current: T): JSX.Element;
    renderSelector(current: T): JSX.Element;
  };
}

export interface CreateGameStepDeriversOptions1<T, D> {
  isType(value: any): value is T;
  renderInstanceItem(item: T): JSX.Element;
  random(context: InstanceContext, dependant: D): T | undefined;
  recommended?(context: InstanceContext): T | undefined;
  fixed?: {
    initializer(
      playerIds: readonly PlayerId[]
    ): ConstantTemplateElement | undefined;
    renderTemplateLabel(current: T): JSX.Element;
    renderSelector(current: T): JSX.Element;
  };
}

interface CreateGameStepOptions0<T> {
  // Used to identify, validate, and find the game step inside the game. Use
  // camelCase!
  id: StepId;

  // Optional: We convert the camelCase id into a label automatically. Only use
  // this if you want a different label for your step
  labelOverride?: string;
  derivers?: CreateGameStepDeriversOptions0<T>;
}

interface CreateGameStepOptions1<T, D> {
  // Used to identify, validate, and find the game step inside the game. Use
  // camelCase!
  id: StepId;

  // Optional: We convert the camelCase id into a label automatically. Only use
  // this if you want a different label for your step
  labelOverride?: string;
  derivers?: CreateGameStepDeriversOptions1<T, D>;
}

export function createGameStep<T>(
  options: CreateGameStepOptions0<T>
): IGameStep<T>;
export function createGameStep<T, D>(
  options: CreateGameStepOptions1<T, D>,
  dependant: IGameStep<D>
): IGameStep<T>;

export function createGameStep<T>(
  {
    id,
    labelOverride,
    derivers,
  }: CreateGameStepOptions0<T> | CreateGameStepOptions1<T, any>,
  dependant?: IGameStep<any>
): IGameStep<T> {
  const gameStep: IGameStep<T> = {
    id,
    label:
      labelOverride ??
      id[0].toUpperCase() + id.replaceAll(/[A-Z]/g, " $&").slice(1),
  };

  if (derivers == null) {
    return gameStep;
  }

  const { renderInstanceItem, random, recommended, fixed } = derivers;
  gameStep.renderInstanceContent = renderInstanceItem;

  gameStep.resolveRandom = (context) =>
    nullthrows(
      random(
        context,
        dependant != null
          ? extractInstanceValue(dependant, context.instance)
          : undefined
      ),
      `Trying to derive the 'random' item when it shouldn't be allowed for id ${id}`
    );

  if (recommended != null) {
    gameStep.resolveDefault = (context) =>
      nullthrows(
        recommended(context),
        `Trying to derive the 'recommended' item when it shouldn't be allowed for id ${id}`
      );
  }

  if (fixed != null) {
    gameStep.renderTemplateFixedLabel = fixed.renderTemplateLabel;
    gameStep.renderTemplateFixedValueSelector = fixed.renderSelector;
    gameStep.initialFixedValue = (playerIds) =>
      nullthrows(
        fixed.initializer(playerIds),
        `Trying to derive the 'initial fixed' item when it shouldn't be allowed for id ${id}`
      );
  }

  gameStep.strategies = ({ playerIds }) => {
    const strategies = [];

    const randVal = random({ playerIds, instance: [] }, undefined);
    if (randVal != null) {
      strategies.push(Strategy.RANDOM);
    }

    if (recommended != null) {
      // TODO: We use an empty instance here, this is problematic because it
      // doesn't allow us to catch cases where the instance is required to
      // calculate the recommended value (e.g. if it relies on the value of
      // a previous step)
      const value = recommended({ playerIds, instance: [] });
      if (value != null) {
        strategies.push(Strategy.DEFAULT);
      }
    }
    if (fixed != null) {
      const value = fixed.initializer(playerIds);
      if (value != null) {
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

function extractInstanceValue<T>(
  gameStep: IGameStep<T>,
  instance: readonly SetupStep[]
): T | null {
  const step = instance.find((setupStep) => setupStep.id === gameStep.id);
  if (step == null) {
    return null;
  }

  if (gameStep.isType == null) {
    invariant_violation(
      `Game step ${gameStep.id} does not have a type predicate defined`
    );
  }

  return type_invariant(
    step.value,
    gameStep.isType,
    `Value ${step.value} couldn't be converted to the type defined by it's type ${gameStep.id}`
  );
}
