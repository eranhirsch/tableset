/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/c/introspect.php
 */
import { asArray, Traversable } from "../internal/Traversable";

/**
 * @returns true if the given predicate returns true for any element of the
 * given Traversable. If no predicate is provided, it defaults to casting the
 * element to bool. If the Traversable is empty, it returns false.
 *
 * If you're looking for `C.none`, use `!C.any`.
 */
const any = <T>(
  traversable: Traversable<T>,
  predicate: (value: T) => boolean = Boolean
): boolean => asArray(traversable).some(predicate);

/**
 * @returns true if the given Traversable contains the value. Strict equality is
 * used.
 */
const contains = <T>(traversable: Traversable<T>, value: T): boolean =>
  asArray(traversable).includes(value);

/**
 * @returns true if the given object-mapper contains the key.
 */
const contains_key = <Tk1 extends keyof any, Tk2 extends Tk1 = Tk1>(
  keyedTraversable: Record<Tk1, unknown>,
  key: Tk2
): boolean => key in keyedTraversable;

/**
 * @returns the number of elements in the given Traversable.
 */
const count = (traversable: Traversable<unknown>): number =>
  asArray(traversable).length;

/**
 * @returns true if the given predicate returns true for every element of the
 * given Traversable. If no predicate is provided, it defaults to casting the
 * element to bool. If the Traversable is empty, returns true.
 *
 * If you're looking for `C.all`, this is it.
 */
const every = <T>(
  traversable: Traversable<T>,
  predicate: (value: T) => boolean = Boolean
): boolean => asArray(traversable).every(predicate);

/**
 * @returns whether the given Traversable is empty.
 */
const is_empty = (container: Traversable<unknown>): boolean =>
  count(container) === 0;

export const C = {
  any,
  contains,
  contains_key,
  count,
  every,
  is_empty,
} as const;
