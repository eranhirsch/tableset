import invariant_violation from "./invariant_violation";

/**
 * Throw when the type predicate fails on x. Notice that this doesn't provide
 * typesafety and is reliant on the predicate provided doing a good job.
 * @param fn A predicate that would receive x
 * @param x the object we are testing on, could be anything
 * @param msg an optional message to throw instead of the default one
 * @returns x as type T
 */
export default function invariant<T>(
  fn: (x: any) => x is T,
  x: any,
  msg?: string
): T {
  if (!fn(x)) {
    invariant_violation(msg ?? `${x} does not fulfil the predicate`);
  }
  return x;
}
