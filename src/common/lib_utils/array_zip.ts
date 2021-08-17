export default function array_zip<T>(a: string[], b: T[]): { [key: string]: T };
export default function array_zip<T>(a: number[], b: T[]): { [key: number]: T };
export default function array_zip<T>(a: (string | number)[], b: T[]) {
  return Object.fromEntries(a.map((x, index) => [x, b[index]]));
}
