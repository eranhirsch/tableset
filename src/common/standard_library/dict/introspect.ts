/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/introspect.php
 */

import { Dict as D, Vec } from "common";

const countValues = (dict: Readonly<Record<keyof any, unknown>>): number =>
  Vec.values(dict).length;

/**
 * @returns whether the two given mapper-obj have the same entries, using strict
 * equality. To guarantee equality of order as well as contents, use `===`.
 */
function equal<Tk extends keyof any, Tv>(
  dict1: Readonly<Record<Tk, Tv>>,
  dict2: Readonly<Record<Tk, Tv>>
): boolean {
  const entries = D.entries(dict1);
  return (
    entries.length === D.countValues(dict2) &&
    !entries.some(([key, value]) => !(key in dict2) || value !== dict2[key])
  );
}

const is_empty = (dict: Readonly<Record<keyof any, unknown>>): boolean =>
  countValues(dict) === 0;

export const Dict = {
  countValues,
  equal,
  is_empty,
} as const;
