import { invariant } from "./invariant";

function assertIsDefined<T>(x: T, msg?: string): asserts x is NonNullable<T> {
  invariant(x != null, msg ?? `Unexpected null encountered`);
}

export function nullthrows<T>(x: T, msg?: string): NonNullable<T> {
  assertIsDefined(x, msg);
  return x;
}
