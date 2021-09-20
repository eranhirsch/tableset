/**
 * Go over each pair of key and value in an object-mapper and compute a new
 * value using both the key and the value.
 * @param input
 * @param mapper A method that takes both the key and the value from the input
 * object and returns the value for the same key in the new object
 */
export function object_map_with_keys<Vin, Vout>(
  input: { [key: string]: Vin },
  mapper: (key: string, value: Vin) => Vout
): { [key: string]: Vout };
export function object_map_with_keys<Vin, Vout>(
  input: { [key: number]: Vin },
  mapper: (key: number, value: Vin) => Vout
): { [key: number]: Vout };
export function object_map_with_keys<Vin, Vout>(
  input: { [key: symbol]: Vin },
  mapper: (key: symbol, value: Vin) => Vout
): { [key: symbol]: Vout };
export function object_map_with_keys<Vin, Vout>(
  input: { [key: string | number | symbol]: Vin },
  mapper: (key: any, value: Vin) => Vout
): { [key: string | number | symbol]: Vout } {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, mapper(key, value)])
  );
}
