import { invariant } from "common";

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
  range,
} as const;
