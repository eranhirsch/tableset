/**
 * Ported (manually) from HSL.
 *
 * Methods not needed in JS:
 * * `slice` === `Array.slice` (technically slice will always return a NEW array
 * and we can consider a version more suitable for react where it would return
 * the SAME array if the indices used mean returning the same array:
 * `arr.slice(0, >length)`)
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/select.php
 */

import { Dict } from "common";
import { DictLike, ValueOf } from "../_private/typeUtils";

/**
 * @returns an array containing only non-null values of the given array.
 */
const filter_nulls = <T>(
  arr: readonly (T | null | undefined)[]
): readonly T[] => filter(arr, (x: T | null | undefined): x is T => x != null);

/**
 * @returns a new array containing only the values for which the given
 * predicate returns true.
 *
 * If you don't need access to the key, see Vec\filter().
 *
 * @see `Array.filter`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.filter_with_key/
 */
const filter_with_key = <T extends DictLike>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => boolean
): readonly ValueOf<T>[] =>
  // TODO: Typing here is hard and I couldn't get it to work. Obviously we
  // want to type `map` so that is returns a Record with the same keys as
  // the input, and we want to handle Partial Records as any other Record
  // when sent to `map`. For now we just cast it and hope it doesn't break.
  values(Dict.filter_with_keys(dict, predicate));

/**
 * @returns a new array containing the keys of the given mapper-object
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.keys/
 */
const keys = <T extends DictLike>(dict: Readonly<T>): readonly (keyof T)[] =>
  Object.keys(dict);

/**
 * @returns an array containing the first n elements of the given array.
 *
 * @see `Array.slice` for a more general way to create sub-arrays
 */
const take = <T>(arr: readonly T[], n: number): readonly T[] =>
  // We don't need to create a new array (which slice does implicitly) when
  // the number of elements we want to take is larger than the array itself.
  n >= arr.length ? arr : n <= 0 ? [] : arr.slice(0, n);

const drop = <T>(arr: readonly T[], n: number): readonly T[] =>
  n <= 0 ? arr : n >= arr.length ? [] : arr.slice(n);

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

////////////////////////////////////////////////////////////////////////////////
////////////////// NOT PART OF THE ORIGINAL HSL ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * @returns the values of the mapper-obj as a vec.
 *
 * Not originally part of the HSL because Hack PHP `dict` types implement the
 * iterator method returning the values, making it usable in any API which takes
 * a Traversable.
 */
const values = <T extends DictLike>(dict: Readonly<T>): readonly ValueOf<T>[] =>
  Object.values(dict);

/**
 * @returns an array of 2-tuples of the key/value pairs of the input mapper-obj.
 *
 * @see `Object.entries` for the native version of the same method, with more
 * correct typing, but more restrictive too.
 */
function entries<T extends DictLike>(
  dict: Readonly<T>
): readonly (readonly [key: keyof T, value: ValueOf<T>])[];
function entries<K extends keyof any, V>(
  dict: Readonly<DictLike<K, V>>
): readonly (readonly [key: K, value: V])[];
function entries<T extends DictLike>(
  dict: Readonly<T>
): readonly (readonly [key: keyof T, value: ValueOf<T>])[] {
  // Object.entries returns strings for everything, but because indexers are
  // always cast to string too (e.g. x[number] === x[`${number}`]) we can fake
  // the indexer here (I hope... haven't tested this properly)
  return Object.entries(dict) as [key: keyof T, value: ValueOf<T>][];
}

/**
 * Our own version of filter to maintain both the styling of our STL and to
 * return a `readonly` array instead of a mutable one as the native `filter`
 * does.
 */
function filter<T, S extends T>(
  arr: readonly T[],
  typePredicate: (x: T, index: number) => x is S
): readonly S[];
function filter<T>(
  arr: readonly T[],
  predicate: (x: T, index: number) => boolean
): readonly T[];
function filter<T>(
  arr: readonly T[],
  predicate: (x: T, index: number) => boolean
): readonly T[] {
  return arr.filter(predicate);
}

/**
 * A mapper that also filters out elements using the same mapper function
 */
const maybe_map = <Tv1, Tv2>(
  arr: readonly Tv1[],
  mapper: (x: Tv1, idx: number) => Tv2 | undefined
): readonly Tv2[] =>
  arr.reduce((out, element, idx) => {
    const mapped = mapper(element, idx);
    return mapped === undefined ? out : out.concat(out, [mapped]);
  }, [] as readonly Tv2[]);

export const Vec = {
  drop,
  entries,
  filter_nulls,
  filter_with_key,
  filter,
  keys,
  maybe_map,
  take,
  unique_by,
  unique,
  values,
} as const;
