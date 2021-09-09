/**
 * Remove items from an object-mapper using a predicate on the values. The
 * result object is a shallow copy with the same key-value pairs except those
 * filtered out.
 * @param input a object-mapper
 * @param predicate A method that would pick values that would be copied to the
 * output object.
 */
export default function object_filter<V>(
  input: { [key: string]: V },
  predicate: (x: V) => boolean
): { [key: string]: V };
export default function object_filter<V>(
  input: { [key: number]: V },
  predicate: (x: V) => boolean
): { [key: number]: V };
export default function object_filter<V>(
  input: { [key: symbol]: V },
  predicate: (x: V) => boolean
): { [key: symbol]: V };
export default function object_filter<V>(
  input: { [key: string | number | symbol]: V },
  predicate: (x: V) => boolean
): { [key: string | number | symbol]: V } {
  return Object.fromEntries(
    Object.entries(input).filter(([key, value]) => predicate(value))
  );
}
