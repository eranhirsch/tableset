import { invariant_violation, Vec } from "common";
import { StepId } from "features/instance/Game";

export type ArrayElement<T> = T extends readonly (infer E)[] ? E : never;

export interface Query<T = unknown> {
  /**
   * Check if the step could resolve to the single value passed through.
   */
  canResolveTo(value: T): boolean;
  /**
   * Use when the step returns an array of variable length.
   */
  willContainNumElements(
    limits: Partial<Record<"min" | "max", number>> | number
  ): boolean;
  /**
   * Use when the step returns an array of fixed length.
   */
  count(): number;
  /**
   * Use when you need the actual value the step would resolve to. Notice that
   * steps with random components resolve undeterministically so can't answer
   * this question unless their config is de-facto a single result setting.
   */
  onlyResolvableValue(): T | undefined;
  /**
   * Use when the step returns an array of values.
   */
  willContainAny(values: T): boolean;
  /**
   * Use when the step returns an array of values.
   */
  willContain(value: ArrayElement<T>): boolean | undefined;
  /**
   * Will the step resolve to any non-null value.
   */
  willResolve(): boolean;
}

export const buildQuery = <T>(
  idForLogging: StepId,
  impl: Partial<Query<T>>
): Query<T> => new Proxy(impl, { get: getProxy(idForLogging) }) as Query<T>;

const getProxy =
  <T>(idForLogging: StepId): ProxyHandler<Partial<Query<T>>>["get"] =>
  (target, prop, receiver) =>
    prop in target
      ? Reflect.get(target, prop, receiver)
      : invariant_violation(
          `Missing implementation of ${String(
            prop
          )} for ${idForLogging}. Available queries on this object: ${Vec.keys(
            target
          ).join(", ")}`
        );
