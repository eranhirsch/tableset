import { tuple, Vec } from "common";

const max = <Tnum extends number>(
  traversable: readonly Tnum[]
): Tnum | undefined => max_by(traversable, (num) => num);

function max_by<T>(
  arr: readonly T[],
  numFunc: (element: T) => number
): T | undefined {
  const max = arr.reduce((max, element) => {
    const num = numFunc(element);
    return max == null || num > max[1] ? tuple(element, num) : max;
  }, undefined as [T, number] | undefined);
  return max != null ? max[0] : undefined;
}

const mean = (arr: readonly number[]): number | undefined =>
  arr.length > 0 ? sum(arr.map((num) => num / arr.length)) : undefined;

function median(arr: readonly number[]): number | undefined {
  const count = arr.length;
  if (count === 0) {
    return;
  }

  const middleIndex = Math.floor(count / 2);
  const sorted = Vec.sort(arr);
  return count % 2 === 0
    ? (sorted[middleIndex - 1] + sorted[middleIndex]) / 2
    : sorted[middleIndex];
}

const min = (arr: readonly number[]): number | undefined =>
  min_by(arr, (num) => num);

function min_by<T>(
  arr: readonly T[],
  numFunc: (element: T) => number
): T | undefined {
  const min = arr.reduce((min, element) => {
    const num = numFunc(element);
    return min == null || num < min[1] ? tuple(element, num) : min;
  }, undefined as [T, number] | undefined);
  return min != null ? min[0] : undefined;
}

const sum = (arr: readonly number[]): number =>
  arr.reduce((sum, num) => sum + num, 0);

function product(arr: readonly number[]): number;
function product(arr: readonly bigint[]): bigint;
function product(arr: readonly any[]): number | bigint {
  return arr.reduce((sum, num) => sum * num);
}

export const MathUtils = {
  max_by,
  max,
  mean,
  median,
  min_by,
  min,
  sum,
  product,
} as const;
