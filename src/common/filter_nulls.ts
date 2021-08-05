export default function filter_nulls<T>(arr: Array<T | null | undefined>): T[] {
  // The best way to filter nulls in TS? (August 2021)
  return arr.flatMap((x) => (x == null ? [] : [x]));
}
