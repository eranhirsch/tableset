import { tuple } from "common";
import {
  instanceValue,
  InstanceValueStep,
} from "features/instance/instanceValue";
import { InstanceContext } from "./createRandomGameStep";
import { OptionsWithDependencies } from "./OptionsWithDependencies";

export const dependenciesInstanceValues = <
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
  dependencies: OptionsWithDependencies<
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
  >["dependencies"]
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

export function maybeFulfillDependency<T>(
  { instance, ...context }: InstanceContext,
  dependency: InstanceValueStep<T> | undefined
): T | null | undefined {
  return dependency == null
    ? undefined
    : instanceValue(dependency, instance, context);
}
