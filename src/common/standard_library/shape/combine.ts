/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/combine.php
 */
import { Shape as S, tuple, Vec } from "common";
import { ValueOf } from "../_private/typeUtils";

/**
 * @returns a new mapper-obj where each element in `keys` maps to the
 * corresponding element in `values`.
 */
const associate = <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  values: readonly Tv[]
): Readonly<Record<Tk, Tv>> => S.from_entries(Vec.zip(keys, values));

/**
 * @returns a new mapper-obj formed by merging the mapper-obj elements of the
 * given array.
 *
 * In the case of duplicate keys, later values will overwrite
 * the previous ones.
 *
 * @see `Dict.merge()` For a fixed number of mapper-objs.
 */
const merge = <T extends Record<keyof any, any>>(
  ...dicts: readonly Readonly<T>[]
): Readonly<T> =>
  // When we only have one dict to flatten we return the same object to optimize
  // for react.
  dicts.length === 1 ? dicts[0] : Object.assign({}, ...dicts);

/**
 * @returns a new mapper-obj where for each key in `left` a 2-tuple with the
 * values for that key in both the `left` and `right` mapper-obj (if any).
 */
const left_join = <
  Tleft extends Record<keyof any, any>,
  Tright extends Record<keyof Tleft, any>
>(
  left: Readonly<Tleft>,
  right: Readonly<Tright>
): Readonly<
  Record<
    keyof Tleft,
    [left: ValueOf<Tleft>, right: ValueOf<Tright> | undefined]
  >
> => S.map_with_key(left, (key, leftValue) => tuple(leftValue, right[key]));

const inner_join = <
  Tleft extends Record<keyof any, any>,
  Tright extends Record<keyof Tleft, any>
>(
  left: Readonly<Tleft>,
  right: Readonly<Tright>
): Readonly<
  Record<keyof Tleft, [left: ValueOf<Tleft>, right: ValueOf<Tright>]>
> =>
  S.filter_nulls(
    // We dont use left-join here because it's harder to do the null checks
    // inside the tuples cleanly without casts.
    S.map_with_key(left, (key, value) =>
      right[key] != null ? tuple(value, right[key]) : null
    )
  );

const outer_join = <
  Tleft extends Record<keyof any, any>,
  Tright extends Record<keyof any, any>
>(
  left: Readonly<Tleft>,
  right: Readonly<Tright>
): Readonly<
  Record<
    keyof Tleft | keyof Tright,
    [left: ValueOf<Tleft> | undefined, right: ValueOf<Tright> | undefined]
  >
> =>
  S.from_keys(
    Vec.unique(
      // TODO: Not sure why we need the cast here, the types should have been
      // merged by typescript without it :(
      [...Vec.keys(left), ...Vec.keys(right)] as (keyof Tleft | keyof Tright)[]
    ),
    (key) => tuple(left[key], right[key])
  );

const compose = <
  Tinner extends Record<keyof any, keyof any>,
  Touter extends Record<ValueOf<Tinner>, any>
>(
  inner: Readonly<Tinner>,
  outer: Readonly<Touter>
): Readonly<Record<keyof Tinner, ValueOf<Touter> | undefined>> =>
  S.map(inner, (innerValue) => outer[innerValue]);

export const Shape = {
  associate,
  inner_join,
  left_join,
  merge,
  outer_join,
  compose,
} as const;