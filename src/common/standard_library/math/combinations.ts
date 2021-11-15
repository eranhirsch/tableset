import { invariant } from "common";
import { factorial } from "./factorial";

const MEMOIZE: Map<[n: number, k: number], bigint> = new Map();

export default function combinations(n: number, k: number): bigint {
  invariant(n >= 0, `Negative N ${n} are not legal`);
  invariant(k >= 0, `Negative K ${k} are not legal`);
  if (k > n) {
    return BigInt(0);
  }
  k = Math.min(k, n - k);
  let memoized = MEMOIZE.get([n, k]);
  if (memoized == null) {
    if (k === 0) {
      memoized = BigInt(1);
    } else {
      memoized = factorial(n) / (factorial(n - k) * factorial(k));
    }
    MEMOIZE.set([n, k], memoized);
  }
  return memoized;
}
