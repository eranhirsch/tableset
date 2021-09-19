class InvariantViolationError extends Error {}

export function invariant_violation(msg?: string): never {
  throw new InvariantViolationError(msg ?? "Unknown invariant violation");
}
