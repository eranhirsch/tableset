function defaultComparator<K>(a: K, b: K): number {
  if (typeof a === "string" && typeof b === "string") {
    return a === b ? 0 : a < b ? -1 : 1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return defaultComparator(`${a}`, `${b}`);
}

export default function array_sort_by<T, K>(
  arr: readonly T[],
  extractor: (x: T) => K,
  comparator: (a: K, b: K) => number = defaultComparator
): readonly T[] {
  const y = [...arr];
  const x = y.sort((a, b) => comparator(extractor(a), extractor(b)));
  return x;
}
