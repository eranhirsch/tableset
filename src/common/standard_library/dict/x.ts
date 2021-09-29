/**
 * Additional methods not found in the Hack Standard Library
 */

/**
 * @returns an array of 2-tuples of the key/value pairs of the input mapper-obj.
 *
 * @see `Object.entries` for the native (badly typed) version of the same
 * method.
 */
function entries<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv> | Partial<Record<Tk, Tv>>>
): readonly [key: Tk, value: Tv][];
function entries<Tv>(
  dict: Readonly<{ [key: keyof any]: Tv }>
): readonly [key: keyof any, value: Tv][] {
  return Object.entries(dict);
}

export const Dict = {
  entries,
} as const;
