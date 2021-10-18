/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/introspect.php
 */

import { Vec } from "common";
import { DictLike, ValueOf } from "../_private/typeUtils";

const size = (dict: Readonly<DictLike>): number => Vec.values(dict).length;

/**
 * @returns whether the two given mapper-obj have the same entries, using strict
 * equality. To guarantee equality of order as well as contents, use `===`.
 */
function equal<T extends DictLike>(
  dict1: Readonly<T>,
  dict2: Readonly<T>
): boolean {
  const entries = Vec.entries(dict1);
  return (
    entries.length === size(dict2) &&
    !entries.some(([key, value]) => !(key in dict2) || value !== dict2[key])
  );
}

const is_empty = (dict: Readonly<Record<keyof any, unknown>>): boolean =>
  size(dict) === 0;

/**
 * Reduces the given object-mapper into a single value by applying an
 * accumulator function against an intermediate result and each key/value.
 */
const reduce_with_key = <T extends DictLike, Ta>(
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

const some_with_key = <T extends DictLike>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>, index: number) => boolean
): boolean =>
  Vec.entries(dict).some(([key, value], index) => predicate(key, value, index));

const some = <T extends DictLike>(
  dict: Readonly<T>,
  predicate: (value: ValueOf<T>, index: number) => boolean
): boolean => some_with_key(dict, (_, value, index) => predicate(value, index));

const every_with_key = <T extends DictLike>(
  dict: Readonly<T>,
  predicate: (key: keyof T, value: ValueOf<T>, index: number) => boolean
): boolean =>
  Vec.entries(dict).every(([key, value], index) =>
    predicate(key, value, index)
  );

const every = <T extends DictLike>(
  dict: Readonly<T>,
  predicate: (value: ValueOf<T>, index: number) => boolean
): boolean =>
  every_with_key(dict, (_, value, index) => predicate(value, index));

export const Dict = {
  size,
  equal,
  is_empty,
  reduce_with_key,
  some,
  some_with_key,
  every,
  every_with_key,
} as const;
