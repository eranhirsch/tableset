/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/async.php
 */
import { Vec, Shape as S, tuple } from "common";

/**
 * @returns a new mapper-object with each value `await`ed in parallel.
 */
const from_async = async <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Promise<Tv>>>
): Promise<Readonly<Record<Tk, Tv>>> =>
  S.from_entries(
    await Vec.map_async(Vec.entries(dict), async ([key, valuePromise]) =>
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
): Promise<Readonly<Partial<Record<Tk, Tv>>>> =>
  S.from_partial_entries(
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
): Promise<Readonly<Partial<Record<Tk, Tv>>>> =>
  filter_with_key_async(dict, (_, value) => valuePredicate(value));

/**
 * Like `filter_async`, but lets you utilize the keys of your dict too.
 *
 * @see `Dict.filter_with_key()` for non-async filters with key.
 */
const filter_with_key_async = async <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (key: Tk, value: Tv) => Promise<boolean>
): Promise<Partial<Readonly<Record<Tk, Tv>>>> =>
  S.map(
    S.filter(
      await S.map_with_key_async(dict, async (key, value) => ({
        value,
        isEnabled: await predicate(key, value),
      })),
      ({ isEnabled }) => isEnabled
      // TODO: Typing here is hard and I couldn't get it to work. Obviously we
      // want to type `map` so that is returns a Record with the same keys as
      // the input, and we want to handle Partial Records as any other Record
      // when sent to `map`. For now we just cast it and hope it doesn't break.
    ) as Record<keyof any, { value: Tv }>,
    ({ value }) => value
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
  from_async(S.map_with_key(dict, (key, value) => valueFunc(key, value)));

export const Shape = {
  filter_async,
  filter_with_key_async,
  from_async,
  from_keys_async,
  map_async,
  map_with_key_async,
} as const;
