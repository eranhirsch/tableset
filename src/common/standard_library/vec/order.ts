/**
 * Ported (manually) from HSL.
 *
 * Methods not needed in JS:
 * * `reverse` === `Array.reverse`
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/order.php
 */
import { Num } from "common";
import { defaultComparator } from "../_private/defaultComparator";

/**
 * @returns a new array containing the range of numbers from start to end
 * inclusive, with the step between elements being step if provided, or 1 by
 * default.
 *
 * If start > end, it returns a descending range instead of an empty one.
 *
 * If you don't need the items to be enumerated, consider `Vec.fill`.
 *
 * @see `range`
 * @see `Vec.fill`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.range/
 */
const range = (
  start: number,
  end: number,
  step: number = 1
): readonly number[] => Array.from(Num.range(start, end + 1, step));

/**
 * @returns a new vec with the values of the given vec in reversed order.
 */
const reverse = <Tv>(arr: readonly Tv[]): readonly Tv[] => [...arr].reverse();

/**
 * @returns an array sorted by the values of the given array.
 *
 * If the optional comparator function isn't provided, the values will be
 * sorted in ascending order. The default comparator also treats
 * numbers as numbers (and not strings): sorting them by value and not by
 * lexical order.
 *
 * @see `Vec.sort_by`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sort/
 */
const sort = <Tv>(
  arr: readonly Tv[],
  comparator: (a: Tv, b: Tv) => number = defaultComparator
): readonly Tv[] => sort_by(arr, (x) => x, comparator);

/**
 * @returns an array sorted by some scalar property of each value of the given
 * array, which is computed by the given function.
 *
 * If the optional comparator function isn't provided, the values will be
 * sorted in ascending order of scalar key. The default comparator also treats
 * numbers as numbers (and not strings): sorting them by value and not by
 * lexical order.
 *
 * @see `Vec.sort`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sort_by/
 */
function sort_by<Tv, Ts>(
  arr: readonly Tv[],
  scalar_func: (x: Tv) => Ts,
  comparator: (a: Ts, b: Ts) => number = defaultComparator
): readonly Tv[] {
  const sorted = [...arr].sort((a, b) =>
    comparator(scalar_func(a), scalar_func(b))
  );
  // We optimize for React by checking that the sorted array is the same as
  // the input array, and in that case return the same object instead of a new
  // copy of it.
  return sorted.some((item, idx) => item !== arr[idx]) ? sorted : arr;
}

export const Vec = {
  range,
  reverse,
  sort_by,
  sort,
} as const;
