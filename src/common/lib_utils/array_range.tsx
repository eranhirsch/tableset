export default function array_range(a: number, b?: number): number[] {
  const from = b == null ? 0 : a;
  const to = b == null ? a : b;

  const n = from < to ? to - from : from - to;

  const res: number[] = Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = from + (from < to ? i : -i);
  }

  return res;
}
