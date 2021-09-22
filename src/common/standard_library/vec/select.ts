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
import { random_offset } from "common";

/**
 * @returns an array containing only the elements of the first array that do
 * not appear in any of the other ones.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.diff/
 */
function diff<Tv>(
  first: Tv[],
  ...rest: [readonly Tv[], ...(readonly Tv[])[]]
): Tv[] {
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
  first: Tv[],
  second: readonly Tv[],
  scalarFunc: (value: Tv) => Ts
): Tv[] {
  const secondScalars = second.map((item) => scalarFunc(item));
  const filtered = first.filter(
    (item) => !secondScalars.includes(scalarFunc(item))
  );
  return filtered.length < first.length ? filtered : first;
}

/**
 * @returns an array containing only non-null values of the given array.
 */
function filter_nulls<Tv>(arr: (Tv | null | undefined)[]): Tv[] {
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
function filter_with_key<Tk extends keyof any, Tv>(
  dict: Readonly<Partial<Record<Tk, Tv>>>,
  predicate: (key: Tk, value: Tv) => boolean
): Tv[];
function filter_with_key<Tv>(
  dict: Readonly<{ [key: string]: Tv }>,
  predicate: (key: string, value: Tv) => boolean
): Tv[];
function filter_with_key<Tv>(
  dict: Readonly<{ [key: number]: Tv }>,
  predicate: (key: number, value: Tv) => boolean
): Tv[];
function filter_with_key<Tv>(
  dict: Readonly<{ [key: symbol]: Tv }>,
  predicate: (key: symbol, value: Tv) => boolean
): Tv[];
function filter_with_key<Tv>(
  dict: Readonly<{ [key: keyof any]: Tv }>,
  predicate: (key: any, value: Tv) => boolean
): Tv[] {
  return Object.entries(dict)
    .filter(([key, value]) => predicate(key, value))
    .map(([, value]) => value);
}

/**
 * @returns an array containing only the elements of the first array that
 * appear in all the other ones.
 *
 * Duplicate values are preserved.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.intersect/
 */
function intersect<Tv>(
  arr: Tv[],
  ...rest: [readonly Tv[], ...(readonly Tv[])[]]
): Tv[] {
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
  dict: Readonly<Partial<Record<Tk, unknown>>>
): Tk[];
function keys(dict: Readonly<{ [key: string]: unknown }>): string[];
function keys(dict: Readonly<{ [key: number]: unknown }>): number[];
function keys(dict: Readonly<{ [key: symbol]: unknown }>): symbol[];
function keys(dict: Readonly<{ [key: keyof any]: unknown }>): unknown[] {
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
function sample<Tv>(arr: Tv[], sampleSize: number): Tv[] {
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
    selectedIndices.add(random_offset(arr));
  }

  return sampleSize < arr.length - sampleSize
    ? [...selectedIndices].sort().map((index) => arr[index])
    : arr.filter((_, index) => !selectedIndices.has(index));
}

/**
 * @returns an array containing the first n elements of the given array.
 *
 * @see `Array.slice` for a more general way to create sub-arrays
 */
const take = <Tv>(arr: Tv[], n: number): Tv[] =>
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
function unique<Tv>(arr: Tv[]): Tv[] {
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
function unique_by<Tv>(arr: Tv[], scalar_func: (item: Tv) => unknown): Tv[] {
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
