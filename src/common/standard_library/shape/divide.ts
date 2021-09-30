/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/divide.php
 */
import { Shape as S, tuple, Vec } from "common";

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
  const enabled = S.filter_with_keys(dict, (key, value) =>
    predicate(key, value)
  );
  const enabledValues = Vec.values(enabled);

  if (Vec.is_empty(enabledValues)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple({} as Partial<Record<Tk, Tv>>, dict);
  }

  if (enabledValues.length === S.size(dict)) {
    // Optimize for react by returning the original object if the partition is
    // trivially one-sided
    return tuple(dict, {} as Partial<Record<Tk, Tv>>);
  }

  return tuple(
    enabled,
    S.filter_keys(dict, (key) => !(key in enabled))
  );
}

export const Shape = {
  partition,
  partition_with_key,
} as const;
