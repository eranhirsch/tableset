function defaultComparator<K>(a: K, b: K): number {
  if (typeof a === "string" && typeof b === "string") {
    return a === b ? 0 : a < b ? -1 : 1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return defaultComparator(`${a}`, `${b}`);
}

/**
 * Sort an array by a key pulled from the items via a mapper
 * @param arr an input array, the array would not be mutated, the result is a
 * new array
 * @param extractor method to extract a value from the items in the array, the
 * array would be sorted by these values
 * @param comparator method to compare the extracted values, @see `Array.sort`.
 * The default impl would sort numbers correctly, unlike `Array.sort`
 * @returns a shallow copy of the array, sorted
 */
export default function array_sort_by<T, K>(
  arr: readonly T[],
  extractor: (x: T) => K,
  comparator: (a: K, b: K) => number = defaultComparator
): readonly T[] {
  const y = [...arr];
  const x = y.sort((a, b) => comparator(extractor(a), extractor(b)));
  return x;
}
