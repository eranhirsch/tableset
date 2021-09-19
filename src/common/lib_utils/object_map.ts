/**
 * Take an object-mapper and creates a new object-mapper were every value is
 * mapped to a new value, keyed by the same key
 * @param input object-mapper
 * @param mapper function that takes values of the input mapper and returns new
 * values to be keyed by the same key as the origin value
 */
export function object_map<Vin, Vout>(
  input: { [key: string]: Vin },
  mapper: (value: Vin) => Vout
): { [key: string]: Vout };
export function object_map<Vin, Vout>(
  input: { [key: number]: Vin },
  mapper: (value: Vin) => Vout
): { [key: number]: Vout };
export function object_map<Vin, Vout>(
  input: { [key: symbol]: Vin },
  mapper: (value: Vin) => Vout
): { [key: symbol]: Vout };
export function object_map<Vin, Vout>(
  input: { [key: string | number | symbol]: Vin },
  mapper: (value: Vin) => Vout
): { [key: string | number | symbol]: Vout } {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, mapper(value)])
  );
}
