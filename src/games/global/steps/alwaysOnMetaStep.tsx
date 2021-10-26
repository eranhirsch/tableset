import { buildQuery } from "games/core/steps/Query";
import { VariableGameStep } from "model/VariableGameStep";

/**
 * A trivial step implementation that could be used as a drop-in for a step
 * while testing, or as a fallback, in order to fulfil dependency typing
 */
const alwaysOnMetaStep: VariableGameStep<boolean> = {
  id: "__alwaysOn",
  label: "<ALWAYS_ON>",
  coerceInstanceEntry: () => true,
  hasValue: () => true,
  extractInstanceValue: () => true,
  query: () => buildQuery("__alwaysOn", { canResolveTo: (value) => value }),
};
export default alwaysOnMetaStep;
