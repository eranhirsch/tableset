import { invariant, nullthrows, Num } from "common";
import factorial from "./factorial";

const MEMOIZE: Map<[n: number, k: number], number> = new Map();

export default function combinations(n: number, k: number): number {
  invariant(n >= 0, `Negative N ${n} are not legal`);
  invariant(k >= 0, `Negative K ${k} are not legal`);
  if (k > n) {
    return 0;
  }
  k = Math.min(k, n - k);
  let memoized = MEMOIZE.get([n, k]);
  if (memoized == null) {
    if (k === 0) {
      memoized = 1;
    } else {
      memoized = nullthrows(
        Num.int(factorial(n)) / Num.int(factorial(n - k) * factorial(k)),
        `Couldn't compute combinations C(${n}, ${k})`
      );
    }
    MEMOIZE.set([n, k], memoized);
  }
  return memoized;
}
