/**
 * Zip two arrays together, creating a map like object keyed by the first array
 * and with values from the second array.
 * @param a the array to be used as values
 * @param b the array to be used as keys
 */
export function array_zip<T>(
  a: readonly string[],
  b: readonly T[]
): { [key: string]: T };
export function array_zip<T>(
  a: readonly number[],
  b: readonly T[]
): { [key: number]: T };
export function array_zip<T>(
  a: readonly symbol[],
  b: readonly T[]
): { [key: symbol]: T };
export function array_zip<T>(
  a: readonly (string | number | symbol)[],
  b: readonly T[]
): { [key: string | number | symbol]: T } {
  return Object.fromEntries(
    a.slice(0, b.length).map((x, index) => [x, b[index]])
  );
}
