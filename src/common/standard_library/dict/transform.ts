/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/transform.php
 */

import { Dict as D, tuple, Vec } from "common";
import { DictLike, ValueOf } from "../_private/typeUtils";

/**
 * @returns a new mapper-obj mapping each value to the number of times it
 * appears in the given array.
 */
const count_values = <Tk extends keyof any>(
  items: readonly Tk[]
): Readonly<Record<Tk, number>> =>
  items.reduce((counters, item) => {
    counters[item] = (counters[item] ?? 0) + 1;
    return counters;
  }, {} as Record<Tk, number>);

/**
 * @returns a new mapper-obj where all the given keys map to the given value.
 */
const fill_keys = <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  value: Tv
): Readonly<Record<Tk, Tv>> =>
  from_entries(keys.map((key) => tuple(key, value)));

/**
 * @returns a new dict formed by merging the mapper-obj elements of the
 * given Traversable.
 *
 * In the case of duplicate keys, later values will overwrite
 * the previous ones.
 *
 * @see `Dict\merge()` for a fixed number of mapper-objects.
 */
const flatten = <T extends DictLike>(
  dicts: readonly Readonly<T>[]
): Readonly<T> => D.merge(...dicts);

/**
 * @returns a new mapper-obj keyed by the values of the given mapper-obj
 * and vice-versa.
 *
 * In case of duplicate values, later keys overwrite the
 * previous ones.
 */
const flip = <T extends DictLike>(
  dict: Readonly<T>
): Readonly<Required<Record<ValueOf<T>, keyof T>>> =>
  pull_with_key(
    dict,
    // Notice that we swap the key and value here, the valueFunc returns the key
    (key) => key,
    // and the keyFunc returns the value
    (_, value) => value
  );

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * function on the corresponding key.
 *
 * @see `Dict.from_key_async()` To use an async function
 * @see `Dict.from_values()` To create a dict from values.
 * @see `Dict\from_entries()` To create a dict from key/value tuples
 */
const from_keys = <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  valueFunc: (key: Tk) => Tv
): Readonly<Required<Record<Tk, Tv>>> => pull(keys, valueFunc, (key) => key);

/**
 * @returns a new mapper-obj where each mapping is defined by the given
 * key/value tuples.
 *
 * In the case of duplicate keys, later values will overwrite the
 * previous ones.
 *
 * @see `Dict.from_keys()` to create a dict from keys.
 * @see `Dict.from_values()` to create a dict from values
 * @see `Object.from_entries()` for the native JS impl without proper typing
 *
 * Also known as `unzip` or `fromItems` in other implementations.
 */
function from_entries<T extends DictLike>(
  entries: Iterable<readonly [key: keyof T, value: ValueOf<T>]>
): Readonly<T>;
function from_entries<Tk extends keyof any, Tv>(
  entries: Iterable<readonly [key: Tk, value: Tv]>
): Readonly<Required<Record<Tk, Tv>>>;
function from_entries<Tk extends keyof any, Tv>(
  entries: Iterable<readonly [key: Tk, value: Tv]>
): Readonly<Required<Record<Tk, Tv>>> {
  // We need this cast because the native JS version of `fromEntries` returns an
  // object mapped on strings no matter what the types of the input array is.
  // This cast should be safe because indexers are always cast to string (e.g.
  // `x[number] === x[`${number}`])
  return Object.freeze(Object.fromEntries(entries) as Required<Record<Tk, Tv>>);
}

/**
 * @returns a new mapper-obj keyed by the result of calling the given function on
 * each corresponding value.
 *
 * In the case of duplicate keys, later values will
 * overwrite the previous ones.
 *
 * @see `Dict.from_keys()` to create a dict from keys.
 * @see `Dict.from_entries()` to create a dict from key/value tuples.
 * @see `Dict.group_by()` to create a dict containing all values with the same
 * keys
 */
const from_values = <Tk extends keyof any, Tv>(
  values: readonly Tv[],
  keyFunc: (value: Tv, index: number) => Tk
): Readonly<Record<Tk, Tv>> => pull(values, (value) => value, keyFunc);

/**
 * @return a mapper-obj keyed by the result of calling the giving function,
 * preserving duplicate values.
 *
 *  - keys are the results of the given function called on the given values.
 *  - values are arrays of original values that all produced the same key.
 *
 * If a value produces an undefined key, it's omitted from the result.
 */
const group_by = <Tk extends keyof any, Tv>(
  values: readonly Tv[],
  keyFunc: (value: Tv) => Tk | undefined
): Readonly<Record<Tk, readonly Tv[]>> =>
  values.reduce((out, value) => {
    const key = keyFunc(value);
    return key == null
      ? out
      : {
          ...out,
          [key]: Vec.concat(out[key] ?? [], [value]),
        };
  }, {} as Readonly<Record<Tk, readonly Tv[]>>);

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * function on the original value.
 *
 * @see `Dict.map_async()` To use an async function.
 */
const map = <T extends DictLike, Tv>(
  dict: Readonly<T>,
  valueFunc: (value: ValueOf<T>, index: number) => Tv
): Readonly<Required<Record<keyof T, Tv>>> =>
  map_with_key(dict, (_, value, index) => valueFunc(value, index));

/**
 * @returns a new mapper-obj where each key is the result of calling the given
 * function on the original key. In the case of duplicate keys, later values
 * will overwrite the previous ones.
 */
const map_keys = <T extends DictLike, Tk extends keyof any>(
  dict: Readonly<T>,
  keyFunc: (key: keyof T, index: number) => Tk
): Readonly<Required<Record<Tk, ValueOf<T>>>> =>
  pull_with_key(dict, (_, value) => value, keyFunc);

const map_with_key = <T extends DictLike, Tv>(
  dict: Readonly<T>,
  valueFunc: (key: keyof T, value: ValueOf<T>, index: number) => Tv
): Readonly<Required<Record<keyof T, Tv>>> =>
  pull_with_key(dict, valueFunc, (key) => key);

/**
 * @returns a new mapper-obj with mapped keys and values.
 *
 *  - values are the result of calling `valueFunc` on the original value
 *  - keys are the result of calling `keyFunc` on the original value.
 * In the case of duplicate keys, later values will overwrite the previous ones.
 */
const pull = <T, Tk extends keyof any, Tv>(
  items: readonly T[],
  valueFunc: (value: T, index: number) => Tv,
  keyFunc: (value: T, index: number) => Tk
): Readonly<Required<Record<Tk, Tv>>> =>
  from_entries(
    items.map((item, index) =>
      tuple(keyFunc(item, index), valueFunc(item, index))
    )
  );

/**
 * @returns a new mapper-obj with mapped keys and values.
 *
 *  - values are the result of calling `valueFunc` on the original value/key
 *  - keys are the result of calling `keyFunc` on the original value/key.
 * In the case of duplicate keys, later values will overwrite the previous ones.
 */
const pull_with_key = <T extends DictLike, Tk extends keyof any, Tv>(
  dict: Readonly<T>,
  valueFunc: (key: keyof T, value: ValueOf<T>, index: number) => Tv,
  keyFunc: (key: keyof T, value: ValueOf<T>, index: number) => Tk
): Readonly<Required<Record<Tk, Tv>>> =>
  pull(
    Vec.entries(dict),
    ([key, value], index) => valueFunc(key, value, index),
    ([key, value], index) => keyFunc(key, value, index)
  );

export const Dict = {
  count_values,
  fill_keys,
  flatten,
  flip,
  from_entries,
  from_keys,
  from_values,
  group_by,
  map_keys,
  map_with_key,
  map,
  pull_with_key,
  pull,
} as const;
