/**
 * Throw when the type predicate fails on x. Notice that this doesn't provide
 * type-safety and is reliant on the predicate provided doing a good job.
 * @param x the object we are testing on, could be anything
 * @param typePredicate A predicate that would receive x
 * @param msg an optional message to throw instead of the default one
 * @returns x as type T
 */

import { invariant } from "./invariant";

export function coerce<T>(
  x: unknown,
  typePredicate: (x: any) => x is T,
  msg?: string
): T {
  invariant(
    typePredicate(x),
    msg ?? `Object ${JSON.stringify(x)} is not of the required type!`
  );
  return x;
}
