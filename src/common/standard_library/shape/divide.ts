/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/divide.php
 */
import { Dict, Shape as S, tuple, Vec } from "common";
import { DictLike, ValueOf } from "../_private/typeUtils";

/**
 * @returns an array containing the original dict split into chunks of the given
 * size.
 *
 * If the original dict doesn't divide evenly, the final chunk will be
 * smaller.
 */
const chunk = <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  size: number
): readonly Readonly<Partial<T>>[] =>
  Vec.chunk(Vec.entries(dict), size).map((chunk) => S.from_entries(chunk));

/**
 * @returns a 2-tuple containing mapper-objs for which the given predicate
 * returned `true` and `false`, respectively.
 */
const partition = <T extends DictLike>(
  dict: Readonly<T>,
  predicate: (value: ValueOf<T>) => boolean
): readonly [
  enabled: Readonly<Partial<Record<keyof T, ValueOf<T>>>>,
  disabled: Readonly<Partial<Record<keyof T, ValueOf<T>>>>
] => partition_with_key(dict, (_, value) => predicate(value));

/**
 * @returns a 2-tuple containing mapper-objs for which the given keyed predicate
 * returned `true` and `false`, respectively.
 */
function partition_with_key<T extends DictLike>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => boolean
): readonly [
  enabled: Readonly<Partial<Record<keyof T, ValueOf<T>>>>,
  disabled: Readonly<Partial<Record<keyof T, ValueOf<T>>>>
] {
  const enabled = S.filter_with_keys(dict, (key, value) =>
    predicate(key, value)
  );
  const enabledValues = Vec.values(enabled);

  if (Vec.is_empty(enabledValues)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple({} as T, dict);
  }

  if (enabledValues.length === Dict.size(dict)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple(dict, {} as T);
  }

  return tuple(
    enabled,
    S.filter_with_keys(dict, (key) => !(key in enabled))
  );
}

export const Shape = {
  chunk,
  partition_with_key,
  partition,
} as const;
