/**
 * Helper type and method to make it easy to work with both arrays and objects.
 */

export type Traversable<T> = readonly T[] | Readonly<Record<keyof any, T>>;
export const asArray = <T>(traversable: Traversable<T>): readonly T[] =>
  Array.isArray(traversable) ? traversable : Object.values(traversable);
