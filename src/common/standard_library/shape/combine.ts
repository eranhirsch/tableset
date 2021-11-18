/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/combine.php
 */
import { Dict, Shape as S, tuple, Vec } from "common";
import { DictLike, ValueOf } from "../_private/typeUtils";

/**
 * @returns a new mapper-obj where each element in `keys` maps to the
 * corresponding element in `values`.
 */
const associate = <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  values: readonly Tv[]
): Readonly<Partial<Record<Tk, Tv>>> => S.from_entries(Vec.zip(keys, values));

const inner_join = <
  Tleft extends DictLike,
  Tright extends DictLike<keyof Tleft, any>
>(
  left: Readonly<Tleft>,
  right: Readonly<Tright>
): Readonly<
  Partial<Record<keyof Tleft, [left: ValueOf<Tleft>, right: ValueOf<Tright>]>>
> =>
  // We dont use left-join here because it's harder to do the null checks
  // inside the tuples cleanly without casts.
  Dict.maybe_map_with_key(left, (key, value) =>
    right[key] != null ? tuple(value, right[key]) : undefined
  );

export const Shape = {
  associate,
  inner_join,
} as const;
