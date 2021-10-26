import { invariant_violation } from "common";
import { buildQuery } from "games/core/steps/Query";
import { VariableGameStep } from "model/VariableGameStep";

const ID = "__neverResolves";

/**
 * A trivial step implementation that could be used as a drop-in for a step
 * while testing, or as a fallback, in order to fulfil dependency typing
 */
const neverResolves: Readonly<VariableGameStep<any>> = {
  id: ID,
  label: "<NEVER_RESOLVES>",
  coerceInstanceEntry: () =>
    invariant_violation(`'coerceInstanceEntry' called on ${ID}`),
  hasValue: () => false,
  extractInstanceValue: () =>
    invariant_violation(`'extractInstanceValue' called on ${ID}`),
  query: () => buildQuery(ID, { willResolve: () => false }),
};
export default neverResolves;
