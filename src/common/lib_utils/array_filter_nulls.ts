/**
 * Remove nulls (and undefined) values from an array
 * @param arr the array to filter
 * @returns a shallow-copy of the array with null values filtered out
 */
export default function array_filter_nulls<T>(
  arr: readonly (T | null | undefined)[]
): readonly T[] {
  // The best way to filter nulls in TS? (August 2021)
  return arr.flatMap((x) => (x == null ? [] : [x]));
}
