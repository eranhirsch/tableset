import { C, tuple, Vec } from "common";
import { asArray, Traversable } from "../_private/Traversable";

const max = <Tnum extends number>(
  traversable: Traversable<Tnum>
): Tnum | undefined => max_by(traversable, (num) => num);

function max_by<T>(
  traversable: Traversable<T>,
  numFunc: (element: T) => number
): T | undefined {
  const max = C.reduce(
    traversable,
    (max, element) => {
      const num = numFunc(element);
      return max == null || num > max[1] ? tuple(element, num) : max;
    },
    undefined as [T, number] | undefined
  );
  return max != null ? max[0] : undefined;
}

function mean(traversable: Traversable<number>): number | undefined {
  const arr = asArray(traversable);
  return arr.length > 0 ? sum(arr.map((num) => num / arr.length)) : undefined;
}

function median(traversable: Traversable<number>): number | undefined {
  const arr = asArray(traversable);
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

const min = (traversable: Traversable<number>): number | undefined =>
  min_by(traversable, (num) => num);

function min_by<T>(
  traversable: Traversable<T>,
  numFunc: (element: T) => number
): T | undefined {
  const min = C.reduce(
    traversable,
    (min, element) => {
      const num = numFunc(element);
      return min == null || num < min[1] ? tuple(element, num) : min;
    },
    undefined as [T, number] | undefined
  );
  return min != null ? min[0] : undefined;
}

const sum = (traversable: Traversable<number>): number =>
  C.reduce(traversable, (sum, num) => sum + num, 0);

export const MathUtils = {
  max_by,
  max,
  mean,
  median,
  min_by,
  min,
  sum,
} as const;
