/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/divide.php
 */
import { C, Dict as d, tuple } from "common";

/**
 * @returns a 2-tuple containing mapper-objs for which the given predicate
 * returned `true` and `false`, respectively.
 */
const partition = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (value: Tv) => boolean
): readonly [
  Readonly<Partial<Record<Tk, Tv>>>,
  Readonly<Partial<Record<Tk, Tv>>>
] => partition_with_key(dict, (_, value) => predicate(value));

/**
 * @returns a 2-tuple containing mapper-objs for which the given keyed predicate
 * returned `true` and `false`, respectively.
 */
function partition_with_key<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  predicate: (key: Tk, value: Tv) => boolean
): readonly [
  Readonly<Partial<Record<Tk, Tv>>>,
  Readonly<Partial<Record<Tk, Tv>>>
] {
  const enabled = d.filter_with_keys(dict, (key, value) =>
    predicate(key, value)
  );

  if (C.count(enabled) === 0) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple({} as Partial<Record<Tk, Tv>>, dict);
  }

  if (C.count(enabled) === C.count(dict)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple(dict, {} as Partial<Record<Tk, Tv>>);
  }

  return tuple(
    enabled,
    d.filter_keys(dict, (key) => !(key in enabled))
  );
}

export const Dict = {
  partition,
  partition_with_key,
} as const;
