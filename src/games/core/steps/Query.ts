import { invariant_violation, Vec } from "common";
import { StepId } from "model/Game";

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
   * Call this method to get the actual value it would resolve to. Notice that
   * if the element has random components this value is not deterministic.
   */
  resolve(): T;
  /**
   * Use when the step returns an array of values.
   */
  willContainAny(values: T): boolean;
  /**
   * Use when the step returns an array of values.
   */
  willContain(value: T extends readonly (infer E)[] ? E : never): boolean;
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
