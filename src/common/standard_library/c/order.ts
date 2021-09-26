/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/c/introspect.php
 */
import { defaultComparator } from "../_private/defaultComparator";

/**
 * @returns true if the given Traversable<Tv> is sorted in ascending order.
 * If two neighboring elements compare equal, this will be considered sorted.
 *
 * If no comparator is provided, the defaultComparator will be used.
 * This will sort numbers by value, and strings by alphabetical order.
 *
 * @see `C.is_sorted_by` to check the order of other types or mixtures of the
 * aforementioned types.
 */
const is_sorted = <Tv>(
  arr: readonly Tv[],
  comparator?: (a: Tv, b: Tv) => number
): boolean => is_sorted_by(arr, (element) => element, comparator);

/**
 * @returns true if the given Traversable<Tv> would be sorted in ascending order
 * after having been `Array.map`ed with scalarFunc sorted in ascending order.
 * If two neighboring elements compare equal, this will be considered sorted.
 *
 * If no comparator is provided, the defaultComparator will be used.
 * This will sort numbers by value, and strings by alphabetical order.
 *
 * @see `C.is_sorted` to check the order without a mapping function.
 */
function is_sorted_by<Tv, Ts>(
  arr: readonly Tv[],
  scalarFunc: (item: Tv) => Ts,
  comparator: (a: Ts, b: Ts) => number = defaultComparator
): boolean {
  const [first, ...rest] = arr;
  if (first == null) {
    // Trivially sorted
    return true;
  }

  let prev = scalarFunc(first);
  for (let i = 0; i < rest.length; i++) {
    const current = scalarFunc(rest[i]);
    if (comparator(prev, current) > 0) {
      return false;
    }
    prev = current;
  }
  return true;
}

export const C = {
  is_sorted,
  is_sorted_by,
} as const;
