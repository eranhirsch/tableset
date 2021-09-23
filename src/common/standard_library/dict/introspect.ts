/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/introspect.php
 */

import { C, Dict as D } from "common";

/**
 * @returns whether the two given mapper-obj have the same entries, using strict
 * equality. To guarantee equality of order as well as contents, use `===`.
 */
const equal = <Tk extends keyof any, Tv>(
  dict1: Readonly<Record<Tk, Tv>>,
  dict2: Readonly<Record<Tk, Tv>>
): boolean =>
  C.count(dict1) === C.count(dict2) &&
  C.is_empty(
    D.filter_with_keys(
      dict1,
      (key, value) => !(key in dict2) || value !== dict2[key]
    )
  );

export const Dict = {
  equal,
} as const;
