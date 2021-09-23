/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/async.php
 */
import { Vec, Dict as d, tuple } from "common";

/**
 * @returns a new mapper-object with each value `await`ed in parallel.
 */
const from_async = async <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Promise<Tv>>>
): Promise<Readonly<Record<Tk, Tv>>> =>
  d.from_entries(
    await Vec.map_async(d.entries(dict), async ([key, valuePromise]) =>
      tuple(key, await valuePromise)
    )
  );

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the corresponding key.
 *
 * @see `Dict.from_keys` for non-async functions
 */
const from_keys_async = async <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  valueFunc: (key: Tk) => Promise<Tv>
): Promise<Readonly<Record<Tk, Tv>>> =>
  d.from_entries(
    await Vec.map_async(keys, async (key) => tuple(key, await valueFunc(key)))
  );

/**
 * @returns a mapper-obj containing only the values for which the given async
 * predicate returns `true`.
 *
 * @see `Dict.filter()` for non-async predicates
 */
const filter_async = async <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  valuePredicate: (value: Tv) => Promise<boolean>
): Promise<Readonly<Record<Tk, Tv>>> =>
  filter_with_key_async(dict, (_, value) => valuePredicate(value));

/**
 * Like `filter_async`, but lets you utilize the keys of your dict too.
 *
 * @see `Dict.filter_with_key()` for non-async filters with key.
 */
const filter_with_key_async = async <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (key: Tk, value: Tv) => Promise<boolean>
): Promise<Readonly<Record<Tk, Tv>>> =>
  d.map(
    d.filter(
      await d.map_with_key_async(dict, async (key, value) =>
        tuple(value, await predicate(key, value))
      ),
      ([, isEnabled]) => isEnabled
    ),
    ([value]) => value
  );

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the original value.
 *
 * @see `Dict.map` for non-async functions.
 */
const map_async = async <Tk extends keyof any, Tv1, Tv2>(
  dict: Readonly<Record<Tk, Tv1>>,
  valueFunc: (value: Tv1) => Promise<Tv2>
): Promise<Readonly<Record<Tk, Tv2>>> =>
  map_with_key_async(dict, (_, value) => valueFunc(value));

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the original key and value.
 *
 * @see `Dict.map` for non-async functions
 */
const map_with_key_async = async <Tk extends keyof any, Tv1, Tv2>(
  dict: Readonly<Record<Tk, Tv1>>,
  valueFunc: (key: Tk, value: Tv1) => Promise<Tv2>
): Promise<Readonly<Record<Tk, Tv2>>> =>
  from_async(d.map_with_key(dict, (key, value) => valueFunc(key, value)));

export const Dict = {
  filter_async,
  filter_with_key_async,
  from_async,
  from_keys_async,
  map_async,
  map_with_key_async,
} as const;
