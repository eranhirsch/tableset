import { MetaGameStep } from "features/instance/MetaGameStep";
import { buildQuery } from "./Query";

/**
 * A trivial step implementation that could be used as a drop-in for a step
 * while testing, or as a fallback, in order to fulfil dependency typing
 */
const createConstantValueMetaStep = <T>(value: T): MetaGameStep<T> => ({
  id: `__constantValue:${value}`,
  computeInstanceValue: () => value,
  query: () =>
    buildQuery(`__constantValue:${value}`, {
      canResolveTo: (x) => value != null && x === value,
      willResolve: () => value != null,
      onlyResolvableValue: () => value,
    }),
});
export default createConstantValueMetaStep;
