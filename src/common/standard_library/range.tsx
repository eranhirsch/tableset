export function* range(a: number, b?: number): Iterable<number> {
  const from = b == null ? 0 : a;
  const to = b == null ? a : b;

  const n = from < to ? to - from : from - to;

  for (let i = 0; i < n; i++) {
    yield from + (from < to ? i : -i);
  }
}
