/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/async.php
 */
import { Dict as D, tuple, Vec } from "common";
import {
  DictLike,
  PromisedType,
  RemappedDict,
  ValueOf,
} from "../_private/typeUtils";

/**
 * @returns a new mapper-object with each value `await`ed in parallel.
 */
const from_async = async <T extends DictLike>(
  dict: Readonly<RemappedDict<T, Promise<ValueOf<T>>>>
): Promise<Readonly<T>> =>
  D.from_entries(
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
const from_keys_async = async <K extends keyof any, V>(
  keys: readonly K[],
  valueFunc: (key: K) => Promise<V>
): Promise<Readonly<Required<Record<K, V>>>> =>
  // TODO: I can't seem to get the types to work here
  // @ts-ignore
  from_async(D.from_keys(keys, valueFunc));

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the original key and value.
 *
 * @see `Dict.map` for non-async functions
 */
const map_with_key_async = async <T extends DictLike, Tv extends Promise<any>>(
  dict: Readonly<T>,
  valueFunc: (key: keyof T, value: ValueOf<T>) => Tv
): Promise<Readonly<RemappedDict<T, PromisedType<Tv>>>> =>
  // TODO: I can't seem to get the types to work here
  // @ts-ignore
  from_async(D.map_with_key(dict, valueFunc));

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the original value.
 *
 * @see `Dict.map` for non-async functions.
 */
const map_async = async <T extends DictLike, Tv extends Promise<any>>(
  dict: Readonly<T>,
  valueFunc: (value: ValueOf<T>) => Tv
): Promise<Readonly<RemappedDict<T, PromisedType<Tv>>>> =>
  map_with_key_async(dict, (_, value) => valueFunc(value));

/**
 * Like `filter_async`, but lets you utilize the keys of your dict too.
 *
 * @see `Dict.filter_with_key()` for non-async filters with key.
 */
async function filter_with_key_async<T extends DictLike>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => Promise<boolean>
): Promise<Readonly<T>> {
  const resolved = await map_with_key_async(dict, predicate);
  return D.filter_with_keys(dict, (key) => resolved[key]);
}

/**
 * @returns a mapper-obj containing only the values for which the given async
 * predicate returns `true`.
 *
 * @see `Dict.filter()` for non-async predicates
 */
const filter_async = async <T extends DictLike>(
  dict: Readonly<T>,
  valuePredicate: (value: ValueOf<T>) => Promise<boolean>
): Promise<Readonly<T>> =>
  filter_with_key_async(dict, (_, value) => valuePredicate(value));

export const Dict = {
  filter_async,
  filter_with_key_async,
  from_async,
  from_keys_async,
  map_async,
  map_with_key_async,
} as const;
