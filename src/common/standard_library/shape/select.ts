/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/select.php
 */
import { Shape as S, tuple, Vec } from "common";
import { ValueOf } from "../_private/typeUtils";

/**
 * @returns a mapper-obj containing only the entries of the first mapper-obj
 * whose keys do not appear in any of the other ones.
 * TODO: Move this to Shape and simplify for Dicts. we don't need all these
 * advanced typing here
 */
function diff_by_key<T extends Record<keyof any, any>, Tk1 extends keyof any>(
  base: Readonly<T>,
  dict1: Readonly<Record<Tk1, unknown>>
): Readonly<Omit<T, Tk1>>;
function diff_by_key<
  T extends Record<keyof any, any>,
  Tk1 extends keyof any,
  Tk2 extends keyof any
>(
  base: Readonly<T>,
  dict1: Readonly<Record<Tk1, unknown>>,
  dict2: Readonly<Record<Tk2, unknown>>
): Readonly<Omit<T, Tk1 | Tk2>>;
function diff_by_key<
  T extends Record<keyof any, any>,
  Tk1 extends keyof any,
  Tk2 extends keyof any,
  Tk3 extends keyof any
>(
  base: Readonly<T>,
  dict1: Readonly<Record<Tk1, unknown>>,
  dict2: Readonly<Record<Tk2, unknown>>,
  dict3: Readonly<Record<Tk3, unknown>>
): Readonly<Omit<T, Tk1 | Tk2 | Tk3>>;
function diff_by_key<
  T extends Record<keyof any, any>,
  Tk1 extends keyof any,
  Tk2 extends keyof any,
  Tk3 extends keyof any,
  Tk4 extends keyof any
>(
  base: Readonly<T>,
  dict1: Readonly<Record<Tk1, unknown>>,
  dict2: Readonly<Record<Tk2, unknown>>,
  dict3: Readonly<Record<Tk3, unknown>>,
  dict4: Readonly<Record<Tk4, unknown>>
): Readonly<Omit<T, Tk1 | Tk2 | Tk3 | Tk4>>;
function diff_by_key<T extends Record<keyof any, any>>(
  base: Readonly<T>,
  ...rest: [
    Readonly<Record<keyof any, unknown>>,
    ...Readonly<Record<keyof any, unknown>>[]
  ]
): Readonly<Omit<T, keyof any>>;
function diff_by_key<T extends Record<keyof any, any>>(
  base: Readonly<T>,
  ...rest: readonly [
    // This forces rest to have at least one item in it
    Readonly<Record<keyof any, unknown>>,
    ...Readonly<Record<keyof any, unknown>>[]
  ]
): Readonly<T> {
  return filter_with_keys(
    base,
    (key) => !rest.some((otherDict) => key in otherDict)
  );
}

/**
 * @returns a mapper-obj containing all except the first `n` entries of the
 * given mapper-obj.
 *
 * @see `Dict.take()` to take only the first `n`.
 */
const drop = <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  n: number
): Readonly<T> =>
  // Optimize for react by returning the same object for a trivial `n` value
  n === 0 ? dict : S.from_entries(Vec.entries(dict).slice(n));

/**
 * @returns a mapper-obj containing only the values for which the given
 * predicate returns `true`. The default predicate is casting the value to
 * boolean.
 *
 * @see `Dict.filter_nulls()` to remove null values in a typechecker-visible
 * way.
 * @see `Dict.filter_async()` to use an async predicate.
 */
const filter = <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  predicate: (value: ValueOf<T>) => boolean = Boolean
): Readonly<T> => filter_with_keys(dict, (_, value) => predicate(value));

/**
 * Just like filter, but your predicate can include the key as well as
 * the value.
 *
 * @see `Dict.filter_with_key_async()` to use an async predicate.
 */
function filter_with_keys<T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => boolean
): Readonly<T> {
  const entries = Vec.entries(dict);
  const filtered = entries.filter(([key, value]) => predicate(key, value));
  // Optimize for react by returning the same object if nothing got filtereS.
  return entries.length === filtered.length
    ? dict
    : (S.from_entries(filtered) as T);
}

type NonNullableRecord<T extends Record<keyof any, any>> = Record<
  keyof T,
  NonNullable<ValueOf<T>>
>;
/**
 * Given a mapper-obj with nullable values, returns a mapper-obj with null
 * values removeS.
 */
function filter_nulls<T extends Record<keyof any, any>>(
  dict: Readonly<T>
): Readonly<NonNullableRecord<T>> {
  const entries = Vec.entries(dict);
  const filtered = entries.filter(
    (entry): entry is [key: keyof T, value: NonNullable<ValueOf<T>>] =>
      entry[1] != null
  );
  // Optimize for react by returning the same object if nothing got filtereS.
  return filtered.length === entries.length
    ? (dict as NonNullableRecord<T>)
    : S.from_entries(filtered);
}

/**
 * @returns a mapper-obj containing only the keys found in both the input
 * container mapper-obj and the given array. The mapper-obj will have the same
 * ordering as the `keys` array.
 */
function select_keys<T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  keys: readonly (keyof T)[]
): Readonly<T> {
  const selected = filter_with_keys(dict, (key) => keys.includes(key));
  // Optimize for react by returning the same object if everything got selecteS.
  return S.size(selected) === S.size(dict) ? dict : selected;
}

/**
 * @returns a mapper-obj containing the first `n` entries of the given
 * mapper-obj
 *
 * @see Dict.drop() to drop the first `n` entries.
 */
const take = <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  n: number
): Readonly<T> =>
  // We don't optimize here because checking the size of the Obj just to see if
  // `n` is bigger than it would probably cost more than the possibility this API
  // would be used trivially anyway.
  S.from_entries(Vec.take(Vec.entries(dict), n));

/**
 * @returns a mapper-obj in which each value appears exactly once. In case of
 * duplicate values, later keys will overwrite the previous ones.
 *
 * @see `Dict.unique_by()` for non-keyof any values.
 */
function unique<T extends Record<keyof any, keyof any>>(
  dict: Readonly<T>
): Readonly<T> {
  const dedupped = S.flip(dict);
  // If after flipping the object has the same number of entries then it had
  // no non-unique values and we can return the same object back.
  // TODO: We have to cast here because typescript is getting really confused
  // with all these keyof and ValueOf being operated on themselves...
  return S.size(dedupped) === S.size(dict) ? dict : (S.flip(dedupped) as T);
}

/**
 * @returns a mapper-obj in which each value appears exactly once, where the
 * value's uniqueness is determined by transforming it to a scalar via the
 * given function. In case of duplicate scalar values, later keys will overwrite
 * the previous ones.
 *
 * @see `Dict.unique()` for keyof any values.
 */
const unique_by = <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  scalarFunc: (value: ValueOf<T>) => unknown
): Readonly<T> =>
  select_keys(dict, [
    // We use a map so our scalarFunc can use any return value it wants, and not
    // just `keyof any`. We create the map keyed by the scalarFunc, and the
    // value as the key for the value it was computed with. The `Map` would
    // enforce unique keys; the resulting values in the Map would be a set of
    // keys which when selected from the original dict would create a mapper-obj
    // where the values map to unique values via the scalarFunc.
    ...new Map(
      Vec.map_with_key(dict, (key, value) => tuple(scalarFunc(value), key))
    ).values(),
  ]);

export const Shape = {
  diff_by_key,
  drop,
  filter,
  filter_with_keys,
  filter_nulls,
  select_keys,
  take,
  unique,
  unique_by,
} as const;
