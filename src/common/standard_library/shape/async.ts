/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/async.php
 */
import { Vec, Shape as S, tuple } from "common";
import { PromisedType, ValueOf } from "../_private/typeUtils";

type PromisedRecord = Record<keyof any, Promise<any>>;
type ResolvedRecord<T extends PromisedRecord> = Record<
  keyof T,
  PromisedType<ValueOf<T>>
>;

/**
 * @returns a new mapper-object with each value `await`ed in parallel.
 */
const from_async = async <T extends PromisedRecord>(
  dict: Readonly<T>
): Promise<Readonly<ResolvedRecord<T>>> =>
  // TODO: Typescript can't deduce the generic type here because it's restricted
  // to return type and not the params in input. Maybe we can make it happen?!
  S.from_entries<ResolvedRecord<T>>(
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
): Promise<Readonly<Record<Tk, Tv>>> =>
  from_async(S.from_keys(keys, valueFunc));

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the original key and value.
 *
 * @see `Dict.map` for non-async functions
 */
const map_with_key_async = async <T extends Record<keyof any, any>, Tv>(
  dict: Readonly<T>,
  valueFunc: (key: keyof T, value: ValueOf<T>) => Promise<Tv>
): Promise<Readonly<Record<keyof T, Tv>>> =>
  from_async(S.map_with_key(dict, valueFunc));

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the original value.
 *
 * @see `Dict.map` for non-async functions.
 */
const map_async = async <T extends Record<keyof any, any>, Tv2>(
  dict: Readonly<T>,
  valueFunc: (value: ValueOf<T>) => Promise<Tv2>
): Promise<Readonly<Record<keyof T, Tv2>>> =>
  map_with_key_async(dict, (_, value) => valueFunc(value));

/**
 * Like `filter_async`, but lets you utilize the keys of your dict too.
 *
 * @see `Dict.filter_with_key()` for non-async filters with key.
 */
const filter_with_key_async = async <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => Promise<boolean>
): Promise<Readonly<T>> => {
  const resolved = await map_with_key_async(dict, predicate);
  return S.filter_with_keys(dict, (key) => resolved[key]);
};

/**
 * @returns a mapper-obj containing only the values for which the given async
 * predicate returns `true`.
 *
 * @see `Dict.filter()` for non-async predicates
 */
const filter_async = async <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  valuePredicate: (value: ValueOf<T>) => Promise<boolean>
): Promise<Readonly<T>> =>
  filter_with_key_async(dict, (_, value) => valuePredicate(value));

export const Shape = {
  filter_async,
  filter_with_key_async,
  from_async,
  from_keys_async,
  map_async,
  map_with_key_async,
} as const;
