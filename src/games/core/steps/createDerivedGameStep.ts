import createGameStep, { CreateGameStepOptions } from "./createGameStep";
import extractInstanceValue from "./extractInstanceValue";
import IGameStep, { InstanceContext } from "./IGameStep";

interface CreateDerivedGameStepOptionsAny extends CreateGameStepOptions {
  dependencies?: [IGameStep<any>, ...IGameStep<any>[]];

  renderDerived(props: {
    context: InstanceContext;
    dependencies: [...any[]];
  }): undefined | JSX.Element;
}

export interface DerivedStepInstanceComponentProps<
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
  context: InstanceContext;
  dependencies: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10];
}

interface CreateDerivedGameStepOptions<
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

  renderDerived(
    props: DerivedStepInstanceComponentProps<
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
  ): undefined | JSX.Element;
}

export default function createDerivedGameStep<
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
  renderDerived,
  ...baseOptions
}: CreateDerivedGameStepOptions<
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

export default function createDerivedGameStep({
  dependencies,
  renderDerived,
  ...baseOptions
}: CreateDerivedGameStepOptionsAny): IGameStep<never> {
  const gameStep = createGameStep(baseOptions);

  gameStep.renderDerivedInstanceContent = (context) => {
    if (dependencies == null) {
      return renderDerived({ context, dependencies: [] });
    }

    if (
      dependencies.some(
        (dependency) =>
          context.instance.find((step) => step.id === dependency.id) == null
      )
    ) {
      // Not all dependencies have a value so we can't compute this step either
      return;
    }

    return renderDerived({
      context,
      dependencies: dependencies.map((dependency) =>
        extractInstanceValue(dependency, context.instance)
      ),
    });
  };

  return gameStep;
}
