import { invariant_violation } from "common";
import { buildQuery } from "games/core/steps/Query";
import { VariableGameStep } from "model/VariableGameStep";

/**
 * A trivial step implementation that could be used as a drop-in for a step
 * while testing, or as a fallback, in order to fulfil dependency typing
 */
function createNegateMetaStep(
  step: VariableGameStep<boolean>
): VariableGameStep<boolean> {
  return {
    id: `__${step.id}_negated`,
    label: `<${step.label}:NEGATED>`,
    coerceInstanceEntry: () => invariant_violation(`unimplemented`),
    hasValue: () => true,
    extractInstanceValue: ({ [step.id]: stepInstanceValue }) =>
      stepInstanceValue === true ? null : true,
    query: (...args) =>
      buildQuery(`__${step.id}_negated`, {
        canResolveTo: (value) => !step.query(...args).canResolveTo(value),
      }),
  };
}
export default createNegateMetaStep;
