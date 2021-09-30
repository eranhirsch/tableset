/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/divide.php
 */
import { Dict as D, tuple, Vec } from "common";
import { ValueOf } from "../_private/typeUtils";

/**
 * @returns a 2-tuple containing mapper-objs for which the given predicate
 * returned `true` and `false`, respectively.
 */
const partition = <T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  predicate: (value: ValueOf<T>) => boolean
): readonly [enabled: Readonly<T>, disabled: Readonly<T>] =>
  partition_with_key(dict, (_, value) => predicate(value));

/**
 * @returns a 2-tuple containing mapper-objs for which the given keyed predicate
 * returned `true` and `false`, respectively.
 */
function partition_with_key<T extends Record<keyof any, any>>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>) => boolean
): readonly [enabled: Readonly<T>, disabled: Readonly<T>] {
  const enabled = D.filter_with_keys(dict, (key, value) =>
    predicate(key, value)
  );
  const enabledValues = Vec.values(enabled);

  if (Vec.is_empty(enabledValues)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple({} as T, dict);
  }

  if (enabledValues.length === D.size(dict)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple(dict, {} as T);
  }

  return tuple(
    enabled,
    D.filter_keys(dict, (key) => !(key in enabled))
  );
}

export const Dict = {
  partition,
  partition_with_key,
} as const;
