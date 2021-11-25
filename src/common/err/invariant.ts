import { invariant_violation } from "./invariant_violation";

export function invariant(cond: any, msg?: string): asserts cond {
  if (!cond) {
    invariant_violation(msg ?? `The condition was false`);
  }
}
