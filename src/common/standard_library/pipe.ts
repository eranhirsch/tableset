import { nullthrows } from "common";

export function $<A, B>(funcOrValueA: (() => A) | A, funcB: (a: A) => B): B;
export function $<A, B, C>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C
): C;
export function $<A, B, C, D>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D
): D;
export function $<A, B, C, D, E>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E
): E;
export function $<A, B, C, D, E, F>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F
): F;
export function $<A, B, C, D, E, F, G>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F,
  funcG: (f: F) => G
): G;
export function $<A, B, C, D, E, F, G, H>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F,
  funcG: (f: F) => G,
  funcH: (g: G) => H
): H;
export function $<A, B, C, D, E, F, G, H, I>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F,
  funcG: (f: F) => G,
  funcH: (g: G) => H,
  funcI: (h: H) => I
): I;
export function $<A, B, C, D, E, F, G, H, I, J>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F,
  funcG: (f: F) => G,
  funcH: (g: G) => H,
  funcI: (h: H) => I,
  funcJ: (i: I) => J
): J;
export function $<
  A,
  B,
  C = never,
  D = never,
  E = never,
  F = never,
  G = never,
  H = never,
  I = never,
  J = never
>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC?: (b: B) => C,
  funcD?: (c: C) => D,
  funcE?: (d: D) => E,
  funcF?: (e: E) => F,
  funcG?: (f: F) => G,
  funcH?: (g: G) => H,
  funcI?: (h: H) => I,
  funcJ?: (i: I) => J
): any;
export function $<
  A,
  B,
  C = never,
  D = never,
  E = never,
  F = never,
  G = never,
  H = never,
  I = never,
  J = never
>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC?: (b: B) => C,
  funcD?: (c: C) => D,
  funcE?: (d: D) => E,
  funcF?: (e: E) => F,
  funcG?: (f: F) => G,
  funcH?: (g: G) => H,
  funcI?: (h: H) => I,
  funcJ?: (i: I) => J
): any;

export function $<
  A,
  B,
  C = never,
  D = never,
  E = never,
  F = never,
  G = never,
  H = never,
  I = never,
  J = never
>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC?: (b: B) => C,
  funcD?: (c: C) => D,
  funcE?: (d: D) => E,
  funcF?: (e: E) => F,
  funcG?: (f: F) => G,
  funcH?: (g: G) => H,
  funcI?: (h: H) => I,
  funcJ?: (i: I) => J
): any {
  // @ts-expect-error
  const a = typeof funcOrValueA === "function" ? funcOrValueA() : funcOrValueA;
  const b = funcB(a);
  if (!funcC) {
    return b;
  }
  const c = funcC(b);
  if (!funcD) {
    return c;
  }
  const d = funcD(c);
  if (!funcE) {
    return d;
  }
  const e = funcE(d);
  if (!funcF) {
    return e;
  }
  const f = funcF(e);
  if (!funcG) {
    return f;
  }
  const g = funcG(f);
  if (!funcH) {
    return g;
  }
  const h = funcH(g);
  if (!funcI) {
    return h;
  }
  const i = funcI(h);
  if (!funcJ) {
    return i;
  }
  return funcJ(i);
}

export const $log =
  <T>(...args: unknown[]): ((x: T) => T) =>
  (x) => {
    console.log(...args, x);
    return x;
  };

export const $nullthrows =
  <T>(msg?: string): ((x: T | null | undefined) => T) =>
  (x) =>
    nullthrows(x, msg);
