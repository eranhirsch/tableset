/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/select.php
 */
import { Dict as D, tuple, Vec } from "common";
import { DictLike, RemappedDict, ValueOf } from "../_private/typeUtils";

const diff_by_key = <T extends DictLike>(
  base: Readonly<T>,
  ...rest: readonly [
    // This forces rest to have at least one item in it
    Readonly<Record<keyof any, unknown>>,
    ...Readonly<Record<keyof any, unknown>>[]
  ]
): Readonly<T> =>
  filter_with_keys(base, (key) => !rest.some((otherDict) => key in otherDict));

/**
 * @returns a mapper-obj containing all except the first `n` entries of the
 * given mapper-obj.
 *
 * @see `Dict.take()` to take only the first `n`.
 */
const drop = <T extends DictLike>(dict: Readonly<T>, n: number): Readonly<T> =>
  // Optimize for react by returning the same object for a trivial `n` value
  n === 0 ? dict : D.from_entries(Vec.drop(Vec.entries(dict), n));

/**
 * @returns a mapper-obj containing only the values for which the given
 * predicate returns `true`. The default predicate is casting the value to
 * boolean.
 *
 * @see `Dict.filter_nulls()` to remove null values in a typechecker-visible
 * way.
 * @see `Dict.filter_async()` to use an async predicate.
 */
function filter<T extends DictLike, S extends T[keyof T]>(
  dict: Readonly<T>,
  typePredicate: (value: T[keyof T]) => value is S
): Readonly<RemappedDict<T, S>>;
function filter<T extends DictLike>(
  dict: Readonly<T>,
  predicate: (value: T[keyof T]) => boolean
): Readonly<T>;
function filter<T extends DictLike>(
  dict: Readonly<T>,
  predicate: (value: T[keyof T]) => boolean = Boolean
): Readonly<T> {
  return filter_with_keys(dict, (_, value) => predicate(value));
}

/**
 * Just like filter, but your predicate can include the key as well as
 * the value.
 *
 * @see `Dict.filter_with_key_async()` to use an async predicate.
 */
function filter_with_keys<T extends DictLike>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => boolean
): Readonly<T> {
  const entries = Vec.entries(dict);
  const filtered = entries.filter(([key, value]) => predicate(key, value));
  // Optimize for react by returning the same object if nothing got filtereD.
  return entries.length === filtered.length
    ? dict
    : (D.from_entries(filtered) as T);
}

/**
 * Given a mapper-obj with nullable values, returns a mapper-obj with null
 * values removeD.
 */
function filter_nulls<T extends DictLike>(
  dict: Readonly<T>
): Readonly<Record<keyof T, Exclude<ValueOf<T>, null | undefined>>> {
  const entries = Vec.entries(dict);
  const filtered = entries.filter(
    (entry): entry is [keyof T, ValueOf<T>] => entry[1] != null
  );
  // Optimize for react by returning the same object if nothing got filtereD.
  return filtered.length === entries.length ? dict : D.from_entries(filtered);
}

/**
 * @returns a mapper-obj containing only the keys found in both the input
 * container mapper-obj and the given array. The mapper-obj will have the same
 * ordering as the `keys` array.
 */
function select_keys<T extends DictLike>(
  dict: Readonly<T>,
  keys: readonly (keyof T)[]
): Readonly<T> {
  const selected = filter_with_keys(dict, (key) => keys.includes(key));
  // Optimize for react by returning the same object if everything got selecteD.
  return D.size(selected) === D.size(dict) ? dict : selected;
}

/**
 * @returns a mapper-obj containing the first `n` entries of the given
 * mapper-obj
 *
 * @see Dict.drop() to drop the first `n` entries.
 */
const take = <T extends DictLike>(
  dict: Readonly<T>,
  n: number
): Readonly<T> => {
  // We don't optimize here because checking the size of the Obj just to see if
  // `n` is bigger than it would probably cost more than the possibility this API
  // would be used trivially anyway.
  const entries = Vec.entries(dict);
  const taken = Vec.take(entries, n);
  return D.from_entries(taken);
};

/**
 * @returns a mapper-obj in which each value appears exactly once. In case of
 * duplicate values, later keys will overwrite the previous ones.
 *
 * @see `Dict.unique_by()` for non-keyof any values.
 */
function unique<T extends DictLike>(dict: Readonly<T>): Readonly<T> {
  const dedupped = D.flip(dict);
  // If after flipping the object has the same number of entries then it had
  // no non-unique values and we can return the same object back.
  // TODO: We have to cast here because typescript is getting really confused
  // with all these keyof and ValueOf being operated on themselves...
  return D.size(dedupped) === D.size(dict)
    ? dict
    : // @ts-ignore
      (D.flip(dedupped) as T);
}

/**
 * @returns a mapper-obj in which each value appears exactly once, where the
 * value's uniqueness is determined by transforming it to a scalar via the
 * given function. In case of duplicate scalar values, later keys will overwrite
 * the previous ones.
 *
 * @see `Dict.unique()` for keyof any values.
 */
const unique_by = <T extends DictLike>(
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

export const maybe_map = <T extends DictLike, Tv>(
  dict: Readonly<T>,
  mapperFunc: (value: ValueOf<T>) => Tv | undefined
): Readonly<RemappedDict<T, Tv>> =>
  maybe_map_with_key(dict, (_, value) => mapperFunc(value));

export const maybe_map_with_key = <T extends DictLike, Tv>(
  dict: Readonly<T>,
  mapperFunc: (key: keyof T, value: ValueOf<T>) => Tv | undefined
): Readonly<RemappedDict<T, Tv>> =>
  // TODO: See why typing here isn't detecting the type for `filter_nulls`
  // properly, requiring this cast :(
  filter_nulls(D.map_with_key(dict, mapperFunc)) as unknown as RemappedDict<
    T,
    Tv
  >;

export const Dict = {
  diff_by_key,
  drop,
  filter_nulls,
  filter_with_keys,
  filter,
  maybe_map_with_key,
  maybe_map,
  select_keys,
  take,
  unique_by,
  unique,
} as const;
