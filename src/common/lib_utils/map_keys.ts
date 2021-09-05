export default function map_keys<V>(
  arr: readonly string[],
  mapper: (x: string) => V
): { [key: string]: V } {
  return Object.fromEntries(arr.map((x) => [x, mapper(x)]));
}
