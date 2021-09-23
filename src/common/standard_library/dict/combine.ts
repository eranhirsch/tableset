/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/combine.php
 */
import { Dict as D, Vec } from "common";

/**
 * @returns a new mapper-obj where each element in `keys` maps to the
 * corresponding element in `values`.
 */
const associate = <Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  values: readonly Tv[]
): Readonly<Record<Tk, Tv>> => D.from_entries(Vec.zip(keys, values));

/**
 * @returns a new mapper-obj formed by merging the mapper-obj elements of the
 * given array.
 *
 * In the case of duplicate keys, later values will overwrite
 * the previous ones.
 *
 * @see `Dict.merge()` For a fixed number of mapper-objs.
 */
const merge = <Tk extends keyof any, Tv>(
  ...dicts: readonly Readonly<Record<Tk, Tv>>[]
): Readonly<Record<Tk, Tv>> =>
  // When we only have one dict to flatten we return the same object to optimize
  // for react.
  dicts.length === 1 ? dicts[0] : Object.assign({}, ...dicts);

export const Dict = {
  associate,
  merge,
} as const;
