import createGameStep, { CreateGameStepOptions } from "./createGameStep";
import extractInstanceValue from "./extractInstanceValue";
import IGameStep, { InstanceContext } from "./IGameStep";

interface CreateComputedGameStepOptionsAny extends CreateGameStepOptions {
  dependencies?: [IGameStep<any>, ...IGameStep<any>[]];

  renderComputed(
    context: InstanceContext,
    ...dependency1: any[]
  ): undefined | JSX.Element;
}

interface CreateComputedGameStepOptions<
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

  renderComputed(
    context: InstanceContext,
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
  ): undefined | JSX.Element;
}

export default function createComputedGameStep<
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
>({
  dependencies,
  renderComputed,
  ...baseOptions
}: CreateComputedGameStepOptions<
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
>): IGameStep<never>;

export default function createComputedGameStep({
  dependencies,
  renderComputed,
  ...baseOptions
}: CreateComputedGameStepOptionsAny): IGameStep<never> {
  const gameStep = createGameStep(baseOptions);

  gameStep.renderComputedInstanceContent = (context) => {
    const resolvedDependancies =
      dependencies?.map((dependency) =>
        extractInstanceValue(dependency, context.instance)
      ) ?? [];
    return renderComputed(context, ...resolvedDependancies);
  };

  return gameStep;
}
