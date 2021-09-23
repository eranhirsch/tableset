/**
 * Ported (manually) from HSL.
 *
 * Methods not needed in JS:
 * * `drop` === `Array.slice`
 * * `filter` === `Array.filter`
 * * `slice` === `Array.slice` (technically slice will always return a NEW array
 * and we can consider a version more suitable for react where it would return
 * the SAME array if the indices used mean returning the same array:
 * `arr.slice(0, >length)`)
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/select.php
 */

import { Dict, Random, vec } from "common";
import { asArray, Traversable } from "../_private/Traversable";

/**
 * @returns an array containing only the elements of the first array that do
 * not appear in any of the other ones.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.diff/
 */
function diff<Tv>(
  first: readonly Tv[],
  ...rest: readonly [readonly Tv[], ...(readonly Tv[])[]]
): readonly Tv[] {
  const filtered = first.filter(
    (item) => !rest.some((otherArray) => otherArray.includes(item))
  );
  return filtered.length < first.length ? filtered : first;
}

/**
 * @returns an array containing only the elements of the first array that do
 * not appear in the second one, where an element's identity is determined by
 * the scalar function
 *
 * @see `Vec.diff`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.diff_by/
 */
function diff_by<Tv, Ts>(
  first: readonly Tv[],
  second: readonly Tv[],
  scalarFunc: (value: Tv) => Ts
): readonly Tv[] {
  const secondScalars = second.map((item) => scalarFunc(item));
  const filtered = first.filter(
    (item) => !secondScalars.includes(scalarFunc(item))
  );
  return filtered.length < first.length ? filtered : first;
}

/**
 * @returns an array containing only non-null values of the given array.
 */
function filter_nulls<Tv>(
  traversable: Traversable<Tv | null | undefined>
): readonly Tv[] {
  const arr = asArray(traversable);
  // The best way to filter nulls in TS? (August 2021)
  const filtered = arr.flatMap((x) => (x == null ? [] : [x]));
  return filtered.length < arr.length ? filtered : (arr as Tv[]);
}

/**
 * @returns a new array containing only the values for which the given
 * predicate returns true.
 *
 * If you don't need access to the key, see Vec\filter().
 *
 * @see `Array.filter`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.filter_with_key/
 */
const filter_with_key = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (key: Tk, value: Tv) => boolean
): readonly Tv[] => vec(Dict.filter_with_keys(dict, predicate));

/**
 * @returns an array containing only the elements of the first array that
 * appear in all the other ones.
 *
 * Duplicate values are preserved.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.intersect/
 */
function intersect<Tv>(
  arr: readonly Tv[],
  ...rest: readonly [readonly Tv[], ...(readonly Tv[])[]]
): readonly Tv[] {
  const intersection = arr.filter((item) =>
    rest.every((otherArray) => otherArray.includes(item))
  );
  // Optimize for react, return the input array if all items intersected
  return intersection.length < arr.length ? intersection : arr;
}

/**
 * @returns a new array containing the keys of the given mapper-object
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.keys/
 */
function keys<Tk extends keyof any>(
  dict: Readonly<Record<Tk, unknown>>
): readonly Tk[];
function keys(dict: Readonly<Record<keyof any, unknown>>): readonly any[] {
  return Object.keys(dict);
}

/**
 * @returns an array containing an unbiased random sample of up to sampleSize
 * elements (fewer iff sampleSize is larger than the size of the array)
 *
 * The output array would maintain the same item order.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sample/
 */
function sample<Tv>(arr: readonly Tv[], sampleSize: 1): readonly [Tv];
function sample<Tv>(arr: readonly Tv[], sampleSize: 2): readonly [Tv, Tv];
function sample<Tv>(arr: readonly Tv[], sampleSize: 3): readonly [Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 4
): readonly [Tv, Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 5
): readonly [Tv, Tv, Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 6
): readonly [Tv, Tv, Tv, Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 7
): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 8
): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 9
): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv];
function sample<Tv>(
  arr: readonly Tv[],
  sampleSize: 10
): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv];
function sample<Tv>(arr: readonly Tv[], sampleSize: number): readonly Tv[];
function sample<Tv>(arr: readonly Tv[], sampleSize: number): readonly Tv[] {
  if (sampleSize >= arr.length) {
    // Trivial solution
    return arr;
  }

  // To optimize the selection we can toggle between an include and exclude
  // logic for the sample; when sampleSize is small we will pick a set of
  // random indices and use them to pick elements from the input array, and
  // when sampleSize is big we will pick which indices to skip when rebuilding
  // the array.

  // We use a set so that we can ignore duplicates
  const selectedIndices: Set<number> = new Set();
  while (selectedIndices.size < Math.min(sampleSize, arr.length - sampleSize)) {
    selectedIndices.add(Random.index(arr));
  }

  return sampleSize <= arr.length - sampleSize
    ? [...selectedIndices].sort().map((index) => arr[index])
    : arr.filter((_, index) => !selectedIndices.has(index));
}

/**
 * @returns an array containing the first n elements of the given array.
 *
 * @see `Array.slice` for a more general way to create sub-arrays
 */
const take = <Tv>(arr: readonly Tv[], n: number): readonly Tv[] =>
  // We don't need to create a new array (which slice does implicitly) when
  // the number of elements we want to take is larger than the array itself.
  n < arr.length
    ? // Slice takes a start and a non-inclusive end, In order to return n
      // elements we need to go one further.
      arr.slice(0, n + 1)
    : arr;

/**
 * @returns an array containing each element of the given array exactly
 * once.
 *
 * @see `Vec.unique_by`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.unique/
 */
function unique<Tv>(arr: readonly Tv[]): readonly Tv[] {
  // We create the de-dupped result aside, so we can compare length and return
  // a new object only if the value changed, this makes it safe for use with
  // React state.
  const newArr = [...new Set(arr)];
  return newArr.length === arr.length ? arr : newArr;
}

/**
 * @returns an array containing each element of the given array exactly
 * once, where uniqueness is determined by calling the given scalar function
 * on the values.
 *
 * In case of duplicate scalar keys, later values will overwrite previous
 * ones.
 *
 * @see `Vec.unique`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.unique_by/
 */
function unique_by<Tv>(
  arr: readonly Tv[],
  scalar_func: (item: Tv) => unknown
): readonly Tv[] {
  const newArr = [
    ...arr
      .reduce(
        (out, item) => out.set(scalar_func(item), item),
        new Map<unknown, Tv>()
      )
      .values(),
  ];
  return arr.length === newArr.length ? arr : newArr;
}

export const Vec = {
  diff_by,
  diff,
  filter_nulls,
  filter_with_key,
  intersect,
  keys,
  sample,
  take,
  unique_by,
  unique,
} as const;
