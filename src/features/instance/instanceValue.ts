import { Templatable } from "features/template/Templatable";
import { ContextBase } from "features/useFeaturesContext";
import { StepId } from "./Game";
import { MetaGameStep } from "./MetaGameStep";

export type InstanceValueStep<T> = Templatable<T> | MetaGameStep<T>;

export function instanceValue<T>(
  step: InstanceValueStep<T>,
  instance: Readonly<Record<StepId, unknown>>,
  context: ContextBase
): T | null {
  const value = instance[step.id];
  if (value != null) {
    // Not the safest, but because our instance object is always the result of
    // an avro decoding we can "kinda" trust that part of our system to do type
    // checking/coercing.
    return value as T;
  }

  return isMetaStep(step) ? step.computeInstanceValue(instance, context) : null;
}

const isMetaStep = <T>(x: unknown): x is MetaGameStep<T> =>
  (x as Partial<MetaGameStep<T>>).computeInstanceValue != null;
