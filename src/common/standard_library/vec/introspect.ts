import { Vec as V } from "common";

/**
 * Equality on Arrays in JS checks pointers, not values, so `[1] !== [1]`. This
 * isn't what you'd naturally expect from equality so this method fixes that.
 * @returns true iff the two arrays contain the same elements in the same order.
 */
const equal = (a: readonly unknown[], b: readonly unknown[]): boolean =>
  a.length === b.length && !a.some((element, index) => element !== b[index]);

const is_empty = (arr: readonly unknown[]): boolean => arr.length === 0;

const count_where = <T>(
  arr: readonly T[],
  predicate: (item: T) => boolean
): number => V.filter(arr, predicate).length;

export const Vec = {
  equal,
  is_empty,
  count_where,
} as const;
