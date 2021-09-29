/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/select.php
 */
import { Dict as D, Vec } from "common";

/**
 * @returns a mapper-obj containing only the entries of the first mapper-obj
 * whose keys do not appear in any of the other ones.
 */
function diff_by_key<Tk1 extends keyof any, Tk2 extends keyof any, Tv>(
  base: Readonly<Record<Tk1, Tv>>,
  dict: Readonly<Record<Tk2, unknown>>
): Readonly<Omit<Record<Tk1, Tv>, Tk2>>;
function diff_by_key<
  Tk1 extends keyof any,
  Tk2 extends keyof any,
  Tk3 extends keyof any,
  Tv
>(
  base: Readonly<Record<Tk1, Tv>>,
  dict1: Readonly<Record<Tk2, unknown>>,
  dict2: Readonly<Record<Tk3, unknown>>
): Readonly<Omit<Record<Tk1, Tv>, Tk2 | Tk3>>;
function diff_by_key<
  Tk1 extends keyof any,
  Tk2 extends keyof any,
  Tk3 extends keyof any,
  Tk4 extends keyof any,
  Tv
>(
  base: Readonly<Record<Tk1, Tv>>,
  dict1: Readonly<Record<Tk2, unknown>>,
  dict2: Readonly<Record<Tk3, unknown>>,
  dict3: Readonly<Record<Tk4, unknown>>
): Readonly<Omit<Record<Tk1, Tv>, Tk2 | Tk3 | Tk4>>;
function diff_by_key<
  Tk1 extends keyof any,
  Tk2 extends keyof any,
  Tk3 extends keyof any,
  Tk4 extends keyof any,
  Tk5 extends keyof any,
  Tv
>(
  base: Readonly<Record<Tk1, Tv>>,
  dict1: Readonly<Record<Tk2, unknown>>,
  dict2: Readonly<Record<Tk3, unknown>>,
  dict3: Readonly<Record<Tk4, unknown>>,
  dict4: Readonly<Record<Tk4, unknown>>
): Readonly<Omit<Record<Tk1, Tv>, Tk2 | Tk3 | Tk4 | Tk5>>;
function diff_by_key<Tk extends keyof any, Tv>(
  base: Readonly<Record<Tk, Tv>>,
  ...rest: [
    Readonly<Record<keyof any, unknown>>,
    ...Readonly<Record<keyof any, unknown>>[]
  ]
): Readonly<Omit<Record<Tk, Tv>, keyof any>>;
function diff_by_key<Tk extends keyof any, Tv>(
  base: Readonly<Record<Tk, Tv>>,
  ...rest: readonly [
    Readonly<Record<keyof any, unknown>>,
    ...Readonly<Record<keyof any, unknown>>[]
  ]
): Readonly<Partial<Record<Tk, Tv>>> {
  return filter_keys(
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
const drop = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  n: number
): Readonly<Partial<Record<Tk, Tv>>> =>
  // Optimize for react by returning the same object for a trivial `n` value
  n === 0 ? dict : D.from_partial_entries(Vec.entries(dict).slice(n));

/**
 * @returns a mapper-obj containing only the values for which the given
 * predicate returns `true`. The default predicate is casting the value to
 * boolean.
 *
 * @see `Dict.filter_nulls()` to remove null values in a typechecker-visible
 * way.
 * @see `Dict.filter_async()` to use an async predicate.
 */
const filter = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (value: Tv) => boolean = Boolean
): Readonly<Partial<Record<Tk, Tv>>> =>
  filter_with_keys(dict, (_, value) => predicate(value));

/**
 * Just like filter, but your predicate can include the key as well as
 * the value.
 *
 * @see `Dict.filter_with_key_async()` to use an async predicate.
 */
function filter_with_keys<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (key: Tk, value: Tv) => boolean
): Readonly<Partial<Record<Tk, Tv>>> {
  const filtered = D.from_partial_entries(
    Vec.entries(dict).filter(([key, value]) => predicate(key, value))
  );
  // Optimize for react by returning the same object if nothing got filtereD.
  return D.size(filtered) === D.size(dict) ? dict : filtered;
}

/**
 * @returns a mapper-obj containing only the keys for which the given predicate
 * returns `true`. The default predicate is casting the key to boolean.
 */
const filter_keys = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (key: Tk) => boolean = Boolean
): Readonly<Partial<Record<Tk, Tv>>> =>
  filter_with_keys(dict, (key) => predicate(key));

/**
 * Given a mapper-obj with nullable values, returns a mapper-obj with null
 * values removeD.
 */
function filter_nulls<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv | null | undefined>>
): Readonly<Record<Tk, Tv>> {
  const filtered = Vec.entries(dict).reduce((noNulls, [key, value]) => {
    if (value != null) {
      noNulls[key] = value;
    }
    return noNulls;
  }, {} as Record<Tk, Tv>);
  // Optimize for react by returning the same object if nothing got filtereD.
  return D.size(filtered) === D.size(dict)
    ? (dict as Record<Tk, Tv>)
    : filtered;
}

/**
 * @returns a mapper-obj containing only the keys found in both the input
 * container mapper-obj and the given array. The mapper-obj will have the same
 * ordering as the `keys` array.
 */
function select_keys<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  keys: readonly Tk[]
): Readonly<Record<Tk, Tv>> {
  const selected = keys.reduce((selected, key) => {
    if (key in dict) {
      selected[key] = dict[key];
    }
    return selected;
  }, {} as Record<Tk, Tv>);
  // Optimize for react by returning the same object if everything got selecteD.
  return D.size(selected) === D.size(dict) ? dict : selected;
}

/**
 * @returns a mapper-obj containing the first `n` entries of the given
 * mapper-obj
 *
 * @see Dict.drop() to drop the first `n` entries.
 */
const take = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  n: number
): Readonly<Partial<Record<Tk, Tv>>> =>
  // If we need to take more entries than the dict has just return the dict.
  n >= D.size(dict)
    ? dict
    : D.from_partial_entries(Vec.take(Vec.entries(dict), n));

/**
 * @returns a mapper-obj in which each value appears exactly once. In case of
 * duplicate values, later keys will overwrite the previous ones.
 *
 * @see `Dict.unique_by()` for non-keyof any values.
 */
function unique<Tk extends keyof any, Tv extends keyof any>(
  dict: Readonly<Record<Tk, Tv>>
): Readonly<Partial<Record<Tk, Tv>>> {
  const dedupped = D.flip(dict);
  // If after flipping the object has the same number of entries then it had
  // no non-unique values and we can return the same object back.
  return D.size(dedupped) === D.size(dict)
    ? dict
    : // We need the first cast because typescript can't duck-type the partial
      // record from the first flip invocation as a Record itself. We need the
      // second cast because typescript at this point lost the typing for the
      // values of the output dict.
      (D.flip(dedupped as Record<keyof any, Tk>) as Partial<Record<Tk, Tv>>);
}

/**
 * @returns a mapper-obj in which each value appears exactly once, where the
 * value's uniqueness is determined by transforming it to a scalar via the
 * given function. In case of duplicate scalar values, later keys will overwrite
 * the previous ones.
 *
 * @see `Dict.unique()` for keyof any values.
 */
const unique_by = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  scalarFunc: (value: Tv) => unknown
): Readonly<Record<Tk, Tv>> =>
  select_keys(dict, [
    // We use a map so our scalarFunc can use any return value it wants, and not
    // just `keyof any`. We create the map keyed by the scalarFunc, and the
    // value as the key for the value it was computed with. The `Map` would
    // enforce unique keys; the resulting values in the Map would be a set of
    // keys which when selected from the original dict would create a mapper-obj
    // where the values map to unique values via the scalarFunc.
    ...new Map(
      Vec.entries(dict).map(([key, value]) => [scalarFunc(value), key])
    ).values(),
  ]);

export const Dict = {
  diff_by_key,
  drop,
  filter,
  filter_with_keys,
  filter_keys,
  filter_nulls,
  select_keys,
  take,
  unique,
  unique_by,
} as const;
