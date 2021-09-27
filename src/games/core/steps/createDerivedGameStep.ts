import { nullthrows } from "common";
import createGameStep, { CreateGameStepOptions } from "./createGameStep";
import IGameStep, { InstanceContext } from "../../../model/IGameStep";

export interface DerivedStepInstanceComponentProps<
  D0 = never,
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never
> {
  dependencies: [
    D0 | null | undefined,
    D1 | null | undefined,
    D2 | null | undefined,
    D3 | null | undefined,
    D4 | null | undefined,
    D5 | null | undefined,
    D6 | null | undefined,
    D7 | null | undefined,
    D8 | null | undefined,
    D9 | null | undefined
  ];
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
> extends Omit<CreateGameStepOptions, "InstanceManualComponent"> {
  dependencies:
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

  InstanceDerivedComponent(
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
  ): JSX.Element | null;
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
  InstanceDerivedComponent,
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
>): Readonly<IGameStep<never>> {
  const gameStep = createGameStep(baseOptions);

  gameStep.InstanceDerivedComponent = ({ context }) =>
    InstanceDerivedComponent({
      dependencies: [
        maybeFulfillDependency(context, dependencies[0]),
        maybeFulfillDependency(context, dependencies[1]),
        maybeFulfillDependency(context, dependencies[2]),
        maybeFulfillDependency(context, dependencies[3]),
        maybeFulfillDependency(context, dependencies[4]),
        maybeFulfillDependency(context, dependencies[5]),
        maybeFulfillDependency(context, dependencies[6]),
        maybeFulfillDependency(context, dependencies[7]),
        maybeFulfillDependency(context, dependencies[8]),
        maybeFulfillDependency(context, dependencies[9]),
      ],
    });

  return gameStep;
}

function maybeFulfillDependency<T>(
  context: InstanceContext,
  dependency: IGameStep<T> | undefined
): T | null | undefined {
  if (dependency == null) {
    return;
  }

  const { hasValue, extractInstanceValue } = dependency;

  if (!nullthrows(hasValue)(context)) {
    return null;
  }

  return nullthrows(extractInstanceValue)(context);
}
