/**
 * Based on the response in stackoverflow.
 * TODO: Extract to it's own utility file.
 *
 * @see https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
 */
function int(x: string): number | undefined;
function int(x: bigint): number;
function int(x: number): number;
function int(x: symbol): undefined;
function int(x: any): number | undefined;
function int(x: any): number | undefined {
  return typeof x === "number"
    ? Math.round(x)
    : typeof x === "string" && !isNaN(x as any) && !isNaN(parseInt(x))
    ? parseInt(x)
    : undefined;
}

export const Num = {
  int,
} as const;
