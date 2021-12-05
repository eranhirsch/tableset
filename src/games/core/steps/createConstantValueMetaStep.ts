import { VariableGameStep } from "model/VariableGameStep";
import { buildQuery } from "./Query";

/**
 * A trivial step implementation that could be used as a drop-in for a step
 * while testing, or as a fallback, in order to fulfil dependency typing
 */
const createConstantValueMetaStep = <T>(value: T): VariableGameStep<T> => ({
  id: `__constantValue:${value}`,
  label: `<CONSTANT:${value}>`,
  hasValue: () => true,
  extractInstanceValue: () => value,
  query: () =>
    buildQuery(`__constantValue:${value}`, {
      canResolveTo: (x) => x === value,
    }),
});
export default createConstantValueMetaStep;