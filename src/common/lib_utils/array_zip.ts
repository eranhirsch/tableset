export default function array_zip<T>(
  a: ReadonlyArray<string>,
  b: ReadonlyArray<T>
): { [key: string]: T };
export default function array_zip<T>(
  a: ReadonlyArray<number>,
  b: ReadonlyArray<T>
): { [key: number]: T };
export default function array_zip<T>(
  a: ReadonlyArray<string | number>,
  b: ReadonlyArray<T>
) {
  return Object.fromEntries(a.map((x, index) => [x, b[index]]));
}
