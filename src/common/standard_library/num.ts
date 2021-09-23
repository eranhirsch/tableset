import { invariant } from "common";

/**
 * Based on the response in stackoverflow.
 * TODO: Extract to it's own utility file.
 *
 * @see https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
 */
function int(x: any): number | undefined {
  return typeof x === "string" && !isNaN(x as any) && !isNaN(parseInt(x))
    ? parseInt(x)
    : undefined;
}

function* range(a: number, b?: number, step: number = 1): Iterable<number> {
  invariant(
    step > 0,
    `Non-positive step (${step})! to create a descending range swap the first and second param instead`
  );

  const from = b == null ? 0 : a;
  const to = b == null ? a : b;

  const n = from < to ? to - from : from - to;

  for (let i = 0; i < n; i += step) {
    yield from + (from < to ? i : -i);
  }
}

export const Num = {
  int,
  range,
} as const;
