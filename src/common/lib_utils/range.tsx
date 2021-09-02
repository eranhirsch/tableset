export default function range(a: number, b: number): number[] {
  const res: number[] = [];
  for (let i = a; i < b; i++) {
    res.push(i);
  }
  return res;
}
