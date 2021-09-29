/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/combine.php
 */
import { C, Dict as D, tuple, Vec } from "common";

/**
 * @returns a new mapper-obj where each element in `keys` maps to the
 * corresponding element in `values`.
 */
function associate<Tv>(
  keys: readonly string[],
  values: readonly Tv[]
): Readonly<Record<string, Tv>>;
function associate<Tv>(
  keys: readonly number[],
  values: readonly Tv[]
): Readonly<Record<number, Tv>>;
function associate<Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  values: readonly Tv[]
): Readonly<Partial<Record<Tk, Tv>>>;
function associate<Tk extends keyof any, Tv>(
  keys: readonly Tk[],
  values: readonly Tv[]
): Readonly<Partial<Record<Tk, Tv>>> {
  return D.from_partial_entries(Vec.zip(keys, values));
}

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

/**
 * @returns a new mapper-obj where for each key in `left` a 2-tuple with the
 * values for that key in both the `left` and `right` mapper-obj (if any).
 */
const left_join = <Tk2 extends keyof any, Tv2, Tk1 extends Tk2, Tv1>(
  left: Readonly<Record<Tk1, Tv1>>,
  right: Readonly<Record<Tk2, Tv2>>
): Readonly<Record<Tk1, [left: Tv1, right: Tv2 | undefined]>> =>
  D.map_with_key(left, (key, leftValue) => tuple(leftValue, right[key]));

/**
 * @returns a new mapper-obj where for each key in `right` a 2-tuple with the
 * values for that key in both the `left` (if any) and `right` mapper-obj.
 */
const right_join = <Tk1 extends keyof any, Tv1, Tk2 extends Tk1, Tv2>(
  left: Readonly<Record<Tk1, Tv1>>,
  right: Readonly<Record<Tk2, Tv2>>
): Readonly<Record<Tk2, [left: Tv1 | undefined, right: Tv2]>> =>
  D.map_with_key(right, (key, rightValue) => tuple(left[key], rightValue));

const inner_join = <Tk2 extends keyof any, Tv2, Tk1 extends Tk2, Tv1>(
  left: Readonly<Record<Tk1, Tv1>>,
  right: Readonly<Record<Tk2, Tv2>>
): Readonly<Partial<Record<Tk1, [left: Tv1, right: Tv2]>>> =>
  C.reduce_with_key(
    left,
    (joined, key, leftValue) => {
      const rightValue = right[key];
      if (rightValue != null) {
        joined[key] = tuple(leftValue, rightValue);
      }
      return joined;
    },
    {} as Record<Tk1, [left: Tv1, right: Tv2]>
  );

const outer_join = <Tk extends keyof any, Tv1, Tv2>(
  left: Readonly<Record<Tk, Tv1>>,
  right: Readonly<Record<Tk, Tv2>>
): Readonly<Record<Tk, [left: Tv1 | undefined, right: Tv2 | undefined]>> =>
  D.from_keys(
    Vec.unique([...Vec.keys(left), ...Vec.keys(right)]),
    (key) => tuple(left[key], right[key])
    // We know this cast is safe because we are taking the keys of existing
    // records and not an arbitrary input vec
  ) as Record<Tk, [Tv1 | undefined, Tv2 | undefined]>;

function compose<Tk1 extends keyof any, Tk2 extends keyof any, Tv>(
  outer: Readonly<Record<Tk1, Tk2>>,
  inner: Readonly<Partial<Record<Tk2, Tv>>>
): Readonly<Record<Tk1, Tv | undefined>>;
function compose<Tk1 extends keyof any, Tk2 extends keyof any, Tv>(
  outer: Readonly<Partial<Record<Tk1, Tk2>>>,
  inner: Readonly<Partial<Record<Tk2, Tv>>>
): Readonly<Partial<Record<Tk1, Tv | undefined>>>;
function compose<Tk1 extends keyof any, Tk2 extends keyof any, Tv>(
  outer: Readonly<Record<Tk1, Tk2>>,
  inner: Readonly<Partial<Record<Tk2, Tv>>>
): Readonly<Record<Tk1, Tv | undefined>> {
  return D.map(outer, (outerValue) => inner[outerValue]);
}

export const Dict = {
  associate,
  inner_join,
  left_join,
  merge,
  outer_join,
  right_join,
  compose,
} as const;
