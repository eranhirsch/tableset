/**
 * Ported (manually) from HSL.
 * 
 * The `pop_(front|back)x?` methods were omitted from this port as they require
 * non-trivial workarounds in order to support mapper-objects. They are also the
 * only HSL methods that take `inout` params and mutate the input.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/c/select.php
 */
import { Dict, invariant, invariant_violation, nullthrows } from "common";
import { asArray, Traversable } from "../private/Traversable";

/**
 * @returns the first value of the given Traversable for which the predicate
 * returns true, or undefined if no such value is found.
 *
 * @see `C.findx` when a value is required
 */
const find = <Tv>(
  traversable: Traversable<Tv>,
  valuePredicate: (element: Tv) => boolean
): Tv | undefined => asArray(traversable).find(valuePredicate);

/**
 * @returns the first value of the given Traversable for which the predicate
 * returns true, or throws if no such value is found.
 *
 * @see `C.find()` if you would prefer undefined if not found.
 */
function findx<Tv>(
  traversable: Traversable<Tv>,
  valuePredicate: (element: Tv) => boolean
): Tv {
  const arr = asArray(traversable);

  // Notice that we don't use the native `find` method and `nullthrows` here
  // because Tv could contain `null` and `undefined`, and the valuePredicate
  // could return true for them and in that case we should return them and not
  // throw.
  for (const element of arr) {
    if (valuePredicate(element)) {
      return element;
    }
  }
  invariant_violation("findx: Couldn't find target value.");
}

/**
 * @returns the key of the first value of the given object-mapper for which
 * the predicate returns true, or undefined if no such value is found.
 */
function find_key<Tk extends keyof any, Tv>(
  keyedTraversable: Readonly<Record<Tk, Tv>>,
  valuePredicate: (value: Tv) => boolean
): Tk | undefined {
  const entry = Dict.entries(keyedTraversable).find(([key, value]) =>
    valuePredicate(value)
  );
  return entry != null ? entry[0] : undefined;
}

/**
 * @returns the first element of the given Traversable, or undefined if the
 * Traversable is empty.
 *
 * @see `C.firstx` for non-empty Traversables.
 * @see `C.nfirst` for possibly null Traversables.
 * @see `C.onlyx` for single-element Traversables.
 * @see `C.first_async` for Promises that yield Traversables.
 */
function first<Tv>(traversable: Traversable<Tv>): Tv | undefined {
  const [first] = asArray(traversable);
  return first;
}

/**
 * @returns the first element of the given Traversable, or throws if the
 * Traversable is empty.
 *
 * @see `C.first` for possibly empty Traversables.
 * @see `C.nfirst` for possibly null Traversables.
 * @see `C.onlyx` for single-element Traversables.
 * @see `C\firstx_async` for Promises that yield Traversables.
 */
function firstx<Tv>(traversable: Traversable<Tv>): Tv {
  const arr = asArray(traversable);
  invariant(arr.length > 0, "firstx: Expected at least one element.");
  return arr[0];
}

/**
 * @returns the first key of the given mapper-obj, or undefined if the
 * mapper-obj is empty.
 *
 * @see `C.first_keyx` for non-empty Traversables.
 */
function first_key<Tk extends keyof any>(
  keyedTraversable: Readonly<Record<Tk, unknown>>
): Tk | undefined {
  const [[key]] = Dict.entries(keyedTraversable);
  return key;
}

/**
 * @returns the first key of the given mapper-obj, or throws if the mapper-obj
 * is empty.
 *
 * @see `C.first_key` for possibly empty Traversables.
 */
const first_keyx = <Tk extends keyof any>(
  keyedTraversable: Readonly<Record<Tk, unknown>>
): Tk =>
  // For keys we can simply check nulls because `null`/`undefined` aren't valid
  // keys (because they don't extend `keyof any`)
  nullthrows(
    first_key(keyedTraversable),
    "first_keyx: Expected at least one element."
  );

/**
 * @returns the last element of the given Traversable, or undefined if the
 * Traversable is empty.
 *
 * @see `C.lastx` for non-empty Traversables.
 * @see `C.onlyx` for single-element Traversables.
 */
function last<Tv>(traversable: Traversable<Tv>): Tv | undefined {
  const arr = asArray(traversable);
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

/**
 * @returns the last element of the given Traversable, or throws if the
 * Traversable is empty.
 *
 * @see `C.last` for possibly empty Traversables.
 * @see `C.onlyx` for single-element Traversables.
 */
function lastx<Tv>(traversable: Traversable<Tv>): Tv {
  const arr = asArray(traversable);
  invariant(arr.length > 0, "lastx: Expected at least one element.");
  return arr[arr.length - 1];
}

/**
 * @returns the last key of the given mapper-obj, or undefined if the mapper-obj
 * is empty.
 *
 * @see `C.last_keyx` for non-empty Traversables.
 */
function last_key<Tk extends keyof any>(
  keyedTraversable: Readonly<Record<Tk, unknown>>
): Tk | undefined {
  const lastEntry = last(Dict.entries(keyedTraversable));
  if (lastEntry == null) {
    return;
  }
  const [key] = lastEntry;
  return key;
}

/**
 * @returns the last key of the given mapper-obj, or throws if the mapper-obj is
 * is empty.
 *
 * @see `C.last_key` for possibly empty Traversables.
 */
const last_keyx = <Tk extends keyof any>(
  keyedTraversable: Readonly<Record<Tk, unknown>>
): Tk =>
  nullthrows(
    last_key(keyedTraversable),
    "last_keyx: Expected at least one element."
  );

/**
 * @returns the first element of the given Traversable, or undefined if the
 * Traversable is null, undefined, or empty.
 *
 * @see `C.first` for non-null Traversables.
 * @see `C.firstx` for non-empty Traversables.
 * @see `C.onlyx` for single-element Traversables.
 */
const nfirst = <Tv>(traversable?: Traversable<Tv> | null): Tv | undefined =>
  traversable != null ? first(traversable) : undefined;

/**
 * @returns the first and only element of the given Traversable, or throws if
 * the Traversable is empty or contains more than one element.
 *
 * An optional message may be passed to for the exception in the error case.
 *
 * @see `C.firstx` for Traversables with more than one element.
 */
function onlyx<Tv>(traversable: Traversable<Tv>, msg?: string): Tv {
  const arr = asArray(traversable);
  invariant(arr.length === 1, msg ?? `onlyx: Expected exactly one element`);
  return arr[0];
}

export const C = {
  find,
  findx,
  find_key,
  first,
  firstx,
  first_key,
  first_keyx,
  last,
  lastx,
  last_key,
  last_keyx,
  nfirst,
  onlyx,
} as const;
