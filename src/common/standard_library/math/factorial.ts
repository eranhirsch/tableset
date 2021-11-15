// Factorials are expensive to compute so we precomputed them for the whole
// range of supported numbers for regular JS computations (2**53)

const PRECOMP_FACT: readonly number[] = [
  0, 1, 2, 6, 24, 120, 720, 5_040, 40_320, 362_880, 3_628_800, 39_916_800,
  479_001_600, 6_227_020_800, 87_178_291_200, 1_307_674_368_000,
  20_922_789_888_000, 355_687_428_096_000,
  // TODO: a typescript bug is preventing us from using numeric separators
  // here. If that is fixed we can add them here too!
  // @see https://www.reddit.com/r/typescript/comments/ppvy41/large_numeric_literal_warning_bug/)
  6402373705728000,
];

export const factorial = (x: number): bigint =>
  maybePreCompBigInt(x) ?? factorial(x - 1) * BigInt(x);

const maybePreCompBigInt = (x: number): bigint | undefined =>
  x < PRECOMP_FACT.length ? BigInt(PRECOMP_FACT[x]) : undefined;