import invariant_violation from "./invariant_violation";

export default function nullthrows<T>(
  x: T | null | undefined,
  msg?: string
): T {
  if (x == null) {
    invariant_violation(msg ?? `Unexpected null encountered`);
  }
  return x;
}
