/**
 * Based on the response in stackoverflow.
 * TODO: Extract to it's own utility file.
 *
 * @see https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
 */
export function asInteger(x: any): number | undefined {
  return typeof x === "string" && !isNaN(x as any) && !isNaN(parseInt(x))
    ? parseInt(x)
    : undefined;
}
