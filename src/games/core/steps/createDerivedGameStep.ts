import { GameStepBase } from "features/instance/GameStepBase";
import { Skippable } from "features/instance/useInstanceActiveSteps";
import { createGameStep, CreateGameStepOptions } from "./createGameStep";
import { InstanceContext } from "./createRandomGameStep";
import { dependenciesInstanceValues } from "./dependenciesInstanceValues";
import { DepsTuple } from "./DepsTuple";
import { OptionsWithDependencies } from "./OptionsWithDependencies";

export interface DerivedGameStep extends GameStepBase, Skippable {
  InstanceDerivedComponent(props: { context: InstanceContext }): JSX.Element;
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
    OptionsWithDependencies<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> {
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
