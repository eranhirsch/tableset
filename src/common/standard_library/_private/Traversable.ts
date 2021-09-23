/**
 * Helper type and method to make it easy to work with both arrays and objects.
 */

import { vec } from "common";

export type Traversable<T> = readonly T[] | Readonly<Record<keyof any, T>>;
export const asArray = <T>(traversable: Traversable<T>): readonly T[] => {
  return Array.isArray(traversable)
    ? traversable
    : vec(traversable as Record<keyof any, T>);
};
