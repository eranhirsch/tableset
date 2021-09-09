/**
 * Takes an input array and creates a mapper-object keyed with the items in the
 * array, with values created by the mapper method.
 * @param arr input array
 * @param mapper mapper method that takes the array items as input and returns
 * the value for the output object
 * @returns an object keyed by the array items, mapped with the mapper
 */
export default function array_map_keys<V>(
  arr: readonly string[],
  mapper: (x: string) => V
): { [key: string]: V } {
  return Object.fromEntries(arr.map((x) => [x, mapper(x)]));
}
