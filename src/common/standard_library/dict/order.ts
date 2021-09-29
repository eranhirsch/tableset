/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/order.php
 */
import { Dict as D, Vec } from "common";

/**
 * @returns a new mapper-obj with the original entries in reversed iteration
 * order.
 */
const reverse = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>
): Readonly<Record<Tk, Tv>> =>
  Vec.entries(dict).reduceRight((out, [key, value]) => {
    out[key] = value;
    return out;
  }, {} as Record<Tk, Tv>);

/**
 * @returns a new mapper-obj with the key value pairs of the given input
 * container in a random order.
 *
 * `shuffle` is not using cryptographically secure randomness.
 */
const shuffle = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>
): Readonly<Record<Tk, Tv>> => D.from_entries(Vec.shuffle(Vec.entries(dict)));

/**
 * @returns a mapper-obj sorted by the values of the given mapper-obj. If
 * the optional comparator function isn't provided, the values will be sorted in
 * ascending order. The default comparator also treats numbers as numbers
 * (and not strings): sorting them by value and not by lexical order.
 *
 * @see `Dict.sort_by()` to sort by some computable property of each value.
 * @see `Dict.sort_by_key()` to sort by the keys of the mapper-obj.
 */
const sort = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  valueComparator?: (a: Tv, b: Tv) => number
): Readonly<Record<Tk, Tv>> => sort_by(dict, (value) => value, valueComparator);

/**
 * @returns a mapper-obj sorted by some scalar property of each value of the
 * given mapper-obj, which is computed by the given function. If the optional
 * comparator function isn't provided, the values will be sorted in ascending
 * order of scalar key. The default comparator also treats numbers as numbers
 * (and not strings): sorting them by value and not by lexical order.
 *
 * @see `Dict.sort()` to sort by the values of the mapper-obj.
 * @see `Dict.sort_by_key()` to sort by the keys of the mapper-obj.
 */
const sort_by = <Tk extends keyof any, Tv, Ts>(
  dict: Readonly<Record<Tk, Tv>>,
  scalarFunc: (value: Tv) => Ts,
  scalarComparator?: (a: Ts, b: Ts) => number
): Readonly<Record<Tk, Tv>> =>
  sort_by_with_key(dict, (_, value) => scalarFunc(value), scalarComparator);

/**
 * @returns a mapper-obj sorted by the keys of the given mapper-obj. If the
 * optional comparator function isn't provided, the keys will be sorted in
 * ascending order. The default comparator also treats numbers as numbers
 * (and not strings): sorting them by value and not by lexical order.
 *
 * @see `Dict\sort()` to sort by the values of the mapper_obj.
 * @see `Dict\sort_by()` to sort by some computable property of each value.
 */
const sort_by_key = <Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  keyComparator?: (a: Tk, b: Tk) => number
): Readonly<Record<Tk, Tv>> =>
  sort_by_with_key(dict, (key) => key, keyComparator);

/**
 * This method is not part of the HSL, but it made sense to abstract the impl
 * for all the different sort methods using it.
 *
 * NOTE: It is currently not exported in the module to not pollute the namespace
 * with too many similar methods. If you feel you need it simply add it and
 * remove this note.
 */
function sort_by_with_key<Tk extends keyof any, Tv, Ts>(
  dict: Readonly<Record<Tk, Tv>>,
  scalarFunc: (key: Tk, value: Tv) => Ts,
  scalarComparator?: (a: Ts, b: Ts) => number
): Readonly<Record<Tk, Tv>> {
  const entries = Vec.entries(dict);
  const sorted = Vec.sort_by(
    entries,
    ([key, value]) => scalarFunc(key, value),
    scalarComparator
  );
  // Optimize for react by returning the same object in case it was already
  // sorted (Notice that we rely on `Vec.sort_by` itself being optimized to
  // return the same object when the input is sorted too!)
  return entries === sorted ? dict : D.from_entries(sorted);
}

export const Dict = {
  reverse,
  shuffle,
  sort,
  sort_by,
  sort_by_key,
} as const;
