export default function filter_keys<V>(
  mapping: { [key: string]: V },
  predicate: (x: string) => boolean
): { [key: string]: V } {
  return Object.fromEntries(
    Object.entries(mapping).filter(([key]) => predicate(key))
  );
}
