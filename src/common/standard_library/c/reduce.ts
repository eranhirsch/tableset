/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/c/reduce.php
 */

import { Dict } from "common";
import { asArray, Traversable } from "../_private/Traversable";

/**
 * Reduces the given Traversable into a single value by applying an accumulator
 * function against an intermediate result and each value.
 */
const reduce = <Tv, Ta>(
  traversable: Traversable<Tv>,
  reducer: (accumulator: Ta, element: Tv) => Ta,
  initial: Ta
): Ta => asArray(traversable).reduce(reducer, initial);

/**
 * Reduces the given object-mapper into a single value by applying an
 * accumulator function against an intermediate result and each key/value.
 */
const reduce_with_key = <Tk extends keyof any, Tv, Ta>(
  keyedTraversable: Readonly<Record<Tk, Tv>>,
  reducer: (accumulator: Ta, key: Tk, value: Tv, index: number) => Ta,
  initial: Ta
): Ta =>
  Dict.entries(keyedTraversable).reduce(
    (accumulator, [key, value], index) =>
      reducer(accumulator, key, value, index),
    initial
  );

export const C = {
  reduce,
  reduce_with_key,
} as const;
