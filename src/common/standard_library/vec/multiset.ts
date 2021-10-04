function diff<Tb, Ta extends Tb>(
  a: readonly Ta[],
  b: readonly Tb[]
): readonly Ta[] {
  let remaining = [...b];
  const out = [];
  for (const item of a) {
    const i = remaining.indexOf(item);
    if (i > -1) {
      remaining.splice(i, 1);
    } else {
      out.push(item);
    }
  }
  return out;
}

function intersect<Tb, Ta extends Tb>(
  a: readonly Ta[],
  b: readonly Tb[]
): readonly (Ta & Tb)[] {
  let remaining = [...b];
  const out = [];
  for (const item of a) {
    const i = remaining.indexOf(item);
    if (i > -1) {
      remaining.splice(i, 1);
      out.push(item);
    }
  }
  return out;
}

function union<Tb, Ta extends Tb>(
  a: readonly Ta[],
  b: readonly Tb[]
): readonly (Ta | Tb)[] {
  let remaining = [...b];
  const out = [];
  for (const item of a) {
    const i = remaining.indexOf(item);
    if (i > -1) {
      remaining.splice(i, 1);
      out.push(item);
    }
  }
  return [...out, ...remaining];
}

export const Vec = {
  diff,
  intersect,
  union,
} as const;
