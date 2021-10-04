// Factorials are expensive to compute so we precomputed them for the whole
// range of supported numbers for regular JS computations (2**53)

const PRECOMP_FACT = Object.freeze({
  0: 0,
  1: 1,
  2: 2,
  3: 6,
  4: 24,
  5: 120,
  6: 720,
  7: 5_040,
  8: 40_320,
  9: 362_880,
  10: 3_628_800,
  11: 39_916_800,
  12: 479_001_600,
  13: 6_227_020_800,
  14: 87_178_291_200,
  15: 1_307_674_368_000,
  16: 20_922_789_888_000,
  17: 355_687_428_096_000,
  // TODO: a typescript bug is preventing us from using numeric separators
  // here. If that is fixed we can add them here too!
  // @see https://www.reddit.com/r/typescript/comments/ppvy41/large_numeric_literal_warning_bug/)
  18: 6402373705728000,
} as const);

type PreCompIdx = keyof typeof PRECOMP_FACT;
const isPreCompIdx = (x: number): x is PreCompIdx => x >= 0 && x <= 18;

export default function factorial(x: PreCompIdx): number;
export default function factorial(x: Exclude<number, PreCompIdx>): bigint;
export default function factorial(x: number): number | bigint {
  return isPreCompIdx(x) ? PRECOMP_FACT[x] : factorial(x - 1) * BigInt(x);
}
