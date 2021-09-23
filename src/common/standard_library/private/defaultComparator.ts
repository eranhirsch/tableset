/**
 * Fixing the JS default comparator to not perform lexical ordering for numbers!
 */
export function defaultComparator<K>(a: K, b: K): number {
  if (typeof a === "string" && typeof b === "string") {
    return a === b ? 0 : a < b ? -1 : 1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return defaultComparator(`${a}`, `${b}`);
}
