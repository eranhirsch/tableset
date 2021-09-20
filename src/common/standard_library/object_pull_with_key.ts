export function object_pull_with_key<Vin, Vout>(
  input: { [key: string]: Vin },
  keyMapper: (key: string, value: Vin) => string,
  valueMapper: (key: string, value: Vin) => Vout
): { [key: string]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: number]: Vin },
  keyMapper: (key: number, value: Vin) => number,
  valueMapper: (key: number, value: Vin) => Vout
): { [key: number]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: symbol]: Vin },
  keyMapper: (key: symbol, value: Vin) => symbol,
  valueMapper: (key: symbol, value: Vin) => Vout
): { [key: symbol]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: number]: Vin },
  keyMapper: (key: number, value: Vin) => string,
  valueMapper: (key: number, value: Vin) => Vout
): { [key: string]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: symbol]: Vin },
  keyMapper: (key: symbol, value: Vin) => string,
  valueMapper: (key: symbol, value: Vin) => Vout
): { [key: string]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: string]: Vin },
  keyMapper: (key: string, value: Vin) => number,
  valueMapper: (key: string, value: Vin) => Vout
): { [key: number]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: symbol]: Vin },
  keyMapper: (key: symbol, value: Vin) => number,
  valueMapper: (key: symbol, value: Vin) => Vout
): { [key: number]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: string]: Vin },
  keyMapper: (key: string, value: Vin) => symbol,
  valueMapper: (key: string, value: Vin) => Vout
): { [key: symbol]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: number]: Vin },
  keyMapper: (key: number, value: Vin) => symbol,
  valueMapper: (key: number, value: Vin) => Vout
): { [key: symbol]: Vout };
export function object_pull_with_key<Vin, Vout>(
  input: { [key: string | number | symbol]: Vin },
  keyMapper: (key: any, value: Vin) => string | number | symbol,
  valueMapper: (key: any, value: Vin) => Vout
): { [key: string | number | symbol]: Vout } {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      keyMapper(key, value),
      valueMapper(key, value),
    ])
  );
}
