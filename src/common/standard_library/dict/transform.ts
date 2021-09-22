/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/transform.php
 */

import { Vec } from "common";

/**
 * @returns an array containing the original dict split into chunks of the given
 * size.
 *
 * If the original dict doesn't divide evenly, the final chunk will be
 * smaller.
 */
function chunk<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  size: number
): readonly Readonly<Record<Tk, Tv>>[];
function chunk<Tv>(
  dict: Readonly<{ [key: keyof any]: Tv }>,
  size: number
): readonly Readonly<{ [key: keyof any]: Tv }>[] {
  return Vec.chunk(Object.entries(dict), size).map((chunk) =>
    from_entries(chunk)
  );
}

/**
 * @returns a new mapper-obj mapping each value to the number of times it
 * appears in the given array.
 */
const count_values = <Tk extends keyof any>(
  arr: readonly Tk[]
): Readonly<Record<Tk, number>> =>
  arr.reduce((out, item) => {
    out[item] = (out[item] ?? 0) + 1;
    return out;
  }, {} as Record<Tk, number>);

/**
 * @returns a new mapper-obj formed by merging the mapper-obj elements of the
 * given array.
 *
 * In the case of duplicate keys, later values will overwrite
 * the previous ones.
 *
 * @see `Dict.merge()` For a fixed number of mapper-objs.
 */
const flatten = <Tk extends keyof any, Tv>(
  dicts: readonly Readonly<Record<Tk, Tv>>[]
): Readonly<Record<Tk, Tv>> => Object.assign({}, ...dicts);

/**
 * @returns a new mapper-obj where all the given keys map to the given value.
 */
const fill_keys = <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  value: Tv
): Readonly<Record<Tk, Tv>> => from_entries(keys.map((key) => [key, value]));

/**
 * @returns a new mapper-obj keyed by the values of the given mapper-obj
 * and vice-versa.
 *
 * In case of duplicate values, later keys overwrite the
 * previous ones.
 */
const flip = <Tk extends keyof any, Tv extends keyof any>(
  dict: Readonly<Record<Tk, Tv>>
): Readonly<Record<Tv, Tk>> =>
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
): Readonly<Record<Tk, Tv>> =>
  from_entries(keys.map((key) => [key, valueFunc(key)]));

/**
 * @returns a new mapper-obj where each mapping is defined by the given key/value
 * tuples.
 *
 * In the case of duplicate keys, later values will overwrite the
 * previous ones.
 *
 * @see `Dict\from_keys()` To create a dict from keys.
 * @see `Dict\from_values()` To create a dict from values
 *
 * Also known as `unzip` or `fromItems` in other implementations.
 *
 * NOTE: This simply wraps the native Object.fromEntries to provide better
 * typing!
 */
function from_entries<Tk extends keyof any, Tv>(
  entries: readonly [Tk, Tv][]
): Readonly<Record<Tk, Tv>>;
function from_entries<Tv>(
  entries: readonly [keyof any, Tv][]
): Readonly<{ [key: keyof any]: Tv }> {
  return Object.fromEntries(entries);
}

/**
 * @returns a new mapper-obj keyed by the result of calling the given function on
 * each corresponding value.
 *
 * In the case of duplicate keys, later values will
 * overwrite the previous ones.
 *
 * @see `Dict\from_keys()` To create a dict from keys.
 * @see `Dict\from_entries()` To create a dict from key/value tuples.
 * @see `Dict\group_by()` To create a dict containing all values with the same
 * keys
 */
const from_values = <Tk extends keyof any, Tv>(
  values: readonly Tv[],
  keyFunc: (value: Tv) => Tk
): Readonly<Record<Tk, Tv>> =>
  from_entries(values.map((value) => [keyFunc(value), value]));

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
    if (key != null) {
      out[key] = (out[key] ?? []).concat(value);
    }
    return out;
  }, {} as Record<Tk, Tv[]>);

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * function on the original value.
 *
 * @see `Dict\map_async()` To use an async function.
 */
const map = <Tk extends keyof any, Tv1, Tv2>(
  dict: Readonly<Record<Tk, Tv1>>,
  valueFunc: (value: Tv1) => Tv2
): Readonly<Record<Tk, Tv2>> =>
  map_with_key(dict, (_, value) => valueFunc(value));

/**
 * @returns a new mapper-obj where each key is the result of calling the given
 * function on the original key. In the case of duplicate keys, later values
 * will overwrite the previous ones.
 */
const map_keys = <Tk1 extends keyof any, Tk2 extends keyof any, Tv>(
  dict: Readonly<Record<Tk1, Tv>>,
  keyFunc: (key: Tk1) => Tk2
): Readonly<Record<Tk2, Tv>> =>
  pull_with_key(
    dict,
    (_, value) => value,
    (key) => keyFunc(key)
  );

const map_with_key = <Tk extends keyof any, Tv1, Tv2>(
  dict: Readonly<Record<Tk, Tv1>>,
  valueFunc: (key: Tk, value: Tv1) => Tv2
): Readonly<Record<Tk, Tv2>> =>
  pull_with_key(
    dict,
    (key, value) => valueFunc(key, value),
    (key) => key
  );

/**
 * @returns a new mapper-obj with mapped keys and values.
 *
 *  - values are the result of calling `valueFunc` on the original value
 *  - keys are the result of calling `keyFunc` on the original value.
 * In the case of duplicate keys, later values will overwrite the previous ones.
 */
const pull = <Tk extends keyof any, Tv1, Tv2>(
  arr: readonly Tv1[],
  valueFunc: (value: Tv1) => Tv2,
  keyFunc: (value: Tv1) => Tk
): Readonly<Record<Tk, Tv2>> =>
  from_entries(arr.map((value) => [keyFunc(value), valueFunc(value)]));

/**
 * @returns a new mapper-obj with mapped keys and values.
 *
 *  - values are the result of calling `valueFunc` on the original value/key
 *  - keys are the result of calling `keyFunc` on the original value/key.
 * In the case of duplicate keys, later values will overwrite the previous ones.
 */
function pull_with_key<Tk1 extends keyof any, Tk2 extends keyof any, Tv1, Tv2>(
  dict: Readonly<Record<Tk1, Tv1>>,
  valueFunc: (key: Tk1, value: Tv1) => Tv2,
  keyFunc: (key: Tk1, value: Tv1) => Tk2
): Readonly<Record<Tk2, Tv2>>;
function pull_with_key<Tv1, Tv2>(
  dict: Readonly<{ [key: keyof any]: Tv1 }>,
  valueFunc: (key: keyof any, value: Tv1) => Tv2,
  keyFunc: (key: keyof any, value: Tv1) => keyof any
): Readonly<{ [key: keyof any]: Tv2 }> {
  return pull(
    Object.entries(dict),
    ([key, value]) => valueFunc(key, value),
    ([key, value]) => keyFunc(key, value)
  );
}

export const Dict = {
  chunk,
  count_values,
  flatten,
  fill_keys,
  flip,
  from_keys,
  from_entries,
  from_values,
  group_by,
  map,
  map_keys,
  map_with_key,
  pull,
  pull_with_key,
} as const;
