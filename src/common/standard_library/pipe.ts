import { coerce, invariant, nullthrows } from "common";

function pipe<A, B>(funcOrValueA: (() => A) | A, funcB: (a: A) => B): B;
function pipe<A, B, C>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C
): C;
function pipe<A, B, C, D>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D
): D;
function pipe<A, B, C, D, E>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E
): E;
function pipe<A, B, C, D, E, F>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F
): F;
function pipe<A, B, C, D, E, F, G>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F,
  funcG: (f: F) => G
): G;
function pipe<A, B, C, D, E, F, G, H>(
  funcOrValueA: (() => A) | A,
  funcB: (a: A) => B,
  funcC: (b: B) => C,
  funcD: (c: C) => D,
  funcE: (d: D) => E,
  funcF: (e: E) => F,
  funcG: (f: F) => G,
  funcH: (g: G) => H
): H;
function pipe<A, B, C, D, E, F, G, H, I>(
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
function pipe<A, B, C, D, E, F, G, H, I, J>(
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
function pipe<
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
function pipe<
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

function pipe<
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

const utilities = {
  log:
    <T>(...args: unknown[]): ((x: T) => T) =>
    (x) => {
      console.log(...args, x);
      return x;
    },

  nullthrows:
    <T>(msg?: string): ((x: T) => NonNullable<T>) =>
    (x) =>
      nullthrows(x, msg),

  invariant:
    <T>(
      predicate: (x: T) => boolean,
      msg?: string | ((x: T) => string)
    ): ((x: T) => T) =>
    (x) => {
      invariant(predicate(x), typeof msg === "function" ? msg(x) : msg);
      return x;
    },

  coerce:
    <T>(
      typePredicate: (x: any) => x is T,
      msg?: string | ((x: unknown) => string)
    ): ((x: unknown) => T) =>
    (x) =>
      coerce(x, typePredicate, typeof msg === "function" ? msg(x) : msg),
} as const;

const pipeModule = Object.assign(pipe, utilities);
export { pipeModule as $, pipeModule as default };
