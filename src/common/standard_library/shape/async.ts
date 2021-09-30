/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/async.php
 */
import { Shape as S, Dict } from "common";
import { ValueOf } from "../_private/typeUtils";

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
  Dict.from_async(S.from_keys(keys, valueFunc));

/**
 * Like `filter_async`, but lets you utilize the keys of your dict too.
 *
 * @see `Dict.filter_with_key()` for non-async filters with key.
 */
const filter_with_key_async = async <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => Promise<boolean>
): Promise<Readonly<Partial<T>>> => {
  const resolved = await Dict.map_with_key_async(dict, predicate);
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
): Promise<Readonly<Partial<T>>> =>
  filter_with_key_async(dict, (_, value) => valuePredicate(value));

export const Shape = {
  filter_async,
  filter_with_key_async,
  from_keys_async,
} as const;
