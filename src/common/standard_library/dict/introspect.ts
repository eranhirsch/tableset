/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/introspect.php
 */

import { Dict as D, Vec } from "common";
import { ValueOf } from "../_private/typeUtils";

const size = (dict: Readonly<Record<keyof any, unknown>>): number =>
  Vec.values(dict).length;

/**
 * @returns whether the two given mapper-obj have the same entries, using strict
 * equality. To guarantee equality of order as well as contents, use `===`.
 */
function equal<T extends Record<keyof any, any>>(
  dict1: Readonly<T>,
  dict2: Readonly<T>
): boolean {
  const entries = Vec.entries(dict1);
  return (
    entries.length === D.size(dict2) &&
    !entries.some(([key, value]) => !(key in dict2) || value !== dict2[key])
  );
}

const is_empty = (dict: Readonly<Record<keyof any, unknown>>): boolean =>
  size(dict) === 0;

/**
 * Reduces the given object-mapper into a single value by applying an
 * accumulator function against an intermediate result and each key/value.
 */
const reduce_with_key = <T extends Record<keyof any, any>, Ta>(
  dict: Readonly<T>,
  reducer: (
    accumulator: Ta,
    key: keyof T,
    value: ValueOf<T>,
    index: number
  ) => Ta,
  initial: Ta
): Ta =>
  Vec.entries(dict).reduce(
    (accumulator, [key, value], index) =>
      reducer(accumulator, key, value, index),
    initial
  );

export const Dict = {
  size,
  equal,
  is_empty,
  reduce_with_key,
} as const;
