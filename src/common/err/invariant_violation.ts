class InvariantViolationError extends Error {}

export default function invariant_violation(msg: string): never {
  throw new InvariantViolationError(msg);
}
