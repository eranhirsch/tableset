import { nullthrows, tuple } from "common";
import { DerivedGameStep } from "model/DerivedGameStep";
import { VariableGameStep } from "model/VariableGameStep";
import { createGameStep, CreateGameStepOptions } from "./createGameStep";
import { InstanceContext } from "./createRandomGameStep";
import { StepWithDependencies } from "./StepWithDependencies";

type DepsTuple<
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
> = [
  D1 | null | undefined,
  D2 | null | undefined,
  D3 | null | undefined,
  D4 | null | undefined,
  D5 | null | undefined,
  D6 | null | undefined,
  D7 | null | undefined,
  D8 | null | undefined,
  D9 | null | undefined,
  D10 | null | undefined
];

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
  dependencies: DepsTuple<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>;
}

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
> extends Omit<CreateGameStepOptions, "InstanceManualComponent">,
    StepWithDependencies<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> {
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
  ): JSX.Element;
  skip?(
    dependencies: DepsTuple<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>
  ): boolean;
}

export const createDerivedGameStep = <
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
  skip,
  ...baseOptions
}: Options<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>) =>
  Object.freeze({
    ...createGameStep(baseOptions),
    InstanceDerivedComponent: ({ context }) =>
      InstanceDerivedComponent({
        dependencies: dependenciesInstanceValues(context, dependencies),
      }),
    skip: (context) =>
      skip?.(dependenciesInstanceValues(context, dependencies)) ?? false,
  } as DerivedGameStep);

const dependenciesInstanceValues = <
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
  context: InstanceContext,
  dependencies: Options<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>["dependencies"]
) =>
  tuple(
    maybeFulfillDependency(context, dependencies[0]),
    maybeFulfillDependency(context, dependencies[1]),
    maybeFulfillDependency(context, dependencies[2]),
    maybeFulfillDependency(context, dependencies[3]),
    maybeFulfillDependency(context, dependencies[4]),
    maybeFulfillDependency(context, dependencies[5]),
    maybeFulfillDependency(context, dependencies[6]),
    maybeFulfillDependency(context, dependencies[7]),
    maybeFulfillDependency(context, dependencies[8]),
    maybeFulfillDependency(context, dependencies[9])
  );

function maybeFulfillDependency<T>(
  context: InstanceContext,
  dependency: VariableGameStep<T> | undefined
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
