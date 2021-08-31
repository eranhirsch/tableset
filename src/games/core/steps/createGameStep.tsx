import nullthrows from "../../../common/err/nullthrows";
import { Strategy } from "../../../core/Strategy";
import { PlayerId } from "../../../features/players/playersSlice";
import { ConstantTemplateElement } from "../../../features/template/templateSlice";
import { StepId } from "../IGame";
import IGameStep, { InstanceContext } from "./IGameStep";

export interface CreateGameStepDeriversOptions<T = never> {
  renderInstanceItem(item: T): JSX.Element;
  random(): T;
  recommended?(context: InstanceContext): T | undefined;
  fixed?: {
    initializer(
      playerIds: readonly PlayerId[]
    ): ConstantTemplateElement | undefined;
    renderTemplateLabel(current: T): JSX.Element;
    renderSelector(current: T): JSX.Element;
  };
}

interface CreateGameStepOptions<T = never> {
  // Used to identify, validate, and find the game step inside the game. Use
  // camelCase!
  id: StepId;

  // Optional: We convert the camelCase id into a label automatically. Only use
  // this if you want a different label for your step
  labelOverride?: string;

  derivers?: CreateGameStepDeriversOptions<T>;
}

export function createGameStep<T = never>({
  id,
  labelOverride,
  derivers,
}: CreateGameStepOptions<T>): IGameStep {
  const gameStep: IGameStep = {
    id,
    label:
      labelOverride ??
      id[0].toUpperCase() + id.replaceAll(/[A-Z]/g, " $&").slice(1),
  };

  if (derivers != null) {
    const { renderInstanceItem, random, recommended, fixed } = derivers;
    gameStep.renderInstanceContent = renderInstanceItem;
    gameStep.resolveRandom = random;
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
      const strategies = [Strategy.OFF, Strategy.RANDOM];
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
      return strategies;
    };
  }

  return gameStep;
}
