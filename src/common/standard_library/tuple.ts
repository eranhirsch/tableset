export function tuple(): [];
export function tuple<Ta>(a: Ta): [Ta];
export function tuple<Ta, Tb>(a: Ta, b: Tb): [Ta, Tb];
export function tuple<Ta, Tb, Tc>(a: Ta, b: Tb, c: Tc): [Ta, Tb, Tc];
export function tuple<Ta, Tb, Tc, Td>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td
): [Ta, Tb, Tc, Td];
export function tuple<Ta, Tb, Tc, Td, Te>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td,
  e: Te
): [Ta, Tb, Tc, Td, Te];
export function tuple<Ta, Tb, Tc, Td, Te, Tf>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td,
  e: Te,
  f: Tf
): [Ta, Tb, Tc, Td, Te, Tf];
export function tuple<Ta, Tb, Tc, Td, Te, Tf, Tg>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td,
  e: Te,
  f: Tf,
  g: Tg
): [Ta, Tb, Tc, Td, Te, Tf, Tg];
export function tuple<Ta, Tb, Tc, Td, Te, Tf, Tg, Th>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td,
  e: Te,
  f: Tf,
  g: Tg,
  h: Th
): [Ta, Tb, Tc, Td, Te, Tf, Tg, Th];
export function tuple<Ta, Tb, Tc, Td, Te, Tf, Tg, Th, Ti>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td,
  e: Te,
  f: Tf,
  g: Tg,
  h: Th,
  i: Ti
): [Ta, Tb, Tc, Td, Te, Tf, Tg, Th, Ti];
export function tuple<Ta, Tb, Tc, Td, Te, Tf, Tg, Th, Ti, Tj>(
  a: Ta,
  b: Tb,
  c: Tc,
  d: Td,
  e: Te,
  f: Tf,
  g: Tg,
  h: Th,
  i: Ti,
  j: Tj
): [Ta, Tb, Tc, Td, Te, Tf, Tg, Th, Ti, Tj];
export function tuple(...items: any[]): any[] {
  return items;
}
