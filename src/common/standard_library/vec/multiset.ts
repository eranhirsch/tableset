import { tuple, Vec as V } from "common";

const diff = <Ta, Tb>(a: readonly Ta[], b: readonly Tb[]): readonly Ta[] =>
  diff_by(a, b, (x) => x);

/**
 * @returns an array containing only the elements of the first array that do
 * not appear in the second one, where an element's identity is determined by
 * the scalar function
 *
 * @see `Vec.diff`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.diff_by/
 */
function diff_by<Ta, Tb, Ts>(
  a: readonly Ta[],
  b: readonly Tb[],
  scalarFunc: (value: Ta | Tb) => Ts
): readonly Ta[] {
  if (V.is_empty(b)) {
    return a;
  }
  
  let remaining = [...V.map(b, scalarFunc)];
  const out = [];
  for (const item of a) {
    const i = remaining.indexOf(scalarFunc(item));
    if (i > -1) {
      remaining.splice(i, 1);
    } else {
      out.push(item);
    }
  }
  return out;
}

const intersect = <Ta, Tb>(
  a: readonly Ta[],
  b: readonly Tb[]
): readonly (Ta & Tb)[] => intersect_by(a, b, (x) => x);

function intersect_by<Ta, Tb, Ts>(
  a: readonly Ta[],
  b: readonly Tb[],
  scalarFunc: (value: Ta | Tb) => Ts
): readonly (Ta & Tb)[] {
  let remaining = [...V.map(b, scalarFunc)];
  const out = [];
  for (const item of a) {
    const i = remaining.indexOf(scalarFunc(item));
    if (i > -1) {
      remaining.splice(i, 1);
      out.push(item as Ta & Tb);
    }
  }
  return out;
}

const union = <Ta, Tb>(
  a: readonly Ta[],
  b: readonly Tb[]
): readonly (Ta | Tb)[] => union_by(a, b, (x) => x);

function union_by<Ta, Tb, Ts>(
  a: readonly Ta[],
  b: readonly Tb[],
  scalarFunc: (value: Ta | Tb) => Ts
): readonly (Ta | Tb)[] {
  let remaining = [...V.map(b, (item) => tuple(item, scalarFunc(item)))];
  const out = [];
  for (const item of a) {
    const i = remaining.findIndex(([_, value]) => value === scalarFunc(item));
    if (i > -1) {
      remaining.splice(i, 1);
    }
    out.push(item as Ta | Tb);
  }
  return [...out, ...V.map(remaining, ([orig]) => orig)];
}

const is_contained_in = <Ta, Tb>(a: readonly Ta[], b: readonly Tb[]): boolean =>
  is_contained_in_by(a, b, (x) => x);

function is_contained_in_by<Ta, Tb, Ts>(
  a: readonly Ta[],
  b: readonly Tb[],
  scalarFunc: (value: Ta | Tb) => Ts
): boolean {
  if (a.length > b.length) {
    return false;
  }

  let remaining = [...V.map(b, scalarFunc)];
  for (const item of a) {
    const i = remaining.indexOf(scalarFunc(item));
    if (i > -1) {
      remaining.splice(i, 1);
    } else {
      return false;
    }
  }
  return true;
}

const is_equal_multiset = <Ta, Tb>(
  a: readonly Ta[],
  b: readonly Tb[]
): boolean => is_equal_multiset_by(a, b, (x) => x);

function is_equal_multiset_by<Ta, Tb, Ts>(
  a: readonly Ta[],
  b: readonly Tb[],
  scalarFunc: (value: Ta | Tb) => Ts
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let remaining = [...V.map(b, scalarFunc)];
  for (const item of a) {
    const i = remaining.indexOf(scalarFunc(item));
    if (i > -1) {
      remaining.splice(i, 1);
    } else {
      return false;
    }
  }

  return true;
}
const is_disjoint = <Ta, Tb>(a: readonly Ta[], b: readonly Tb[]): boolean =>
  is_disjoint_by(a, b, (x) => x);

function is_disjoint_by<Ta, Tb, Ts>(
  a: readonly Ta[],
  b: readonly Tb[],
  scalarFunc: (value: Ta | Tb) => Ts
): boolean {
  for (const item of a) {
    const i = b.findIndex((x) => scalarFunc(item) === scalarFunc(x));
    if (i !== -1) {
      return false;
    }
  }
  return true;
}

export const Vec = {
  diff_by,
  diff,
  intersect_by,
  intersect,
  is_contained_in_by,
  is_contained_in,
  is_disjoint_by,
  is_disjoint,
  is_equal_multiset_by,
  is_equal_multiset,
  union_by,
  union,
} as const;
