/**
 * Ported (manually) from HSL.
 *
//  * Methods not needed in JS:
//  * * `from_async` === `Promise.all`
//  *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/dict/async.php
 */

/**
 * @returns a new mapper-object with each value `await`ed in parallel.
 */
async function from_async<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Promise<Tv>>>
): Promise<Readonly<Record<Tk, Tv>>>;
async function from_async<Tv>(
  dict: Readonly<{
    [key: string]: Promise<Tv>;
  }>
): Promise<{ [key: string]: Tv }>;
async function from_async<Tv>(
  dict: Readonly<{
    [key: number]: Promise<Tv>;
  }>
): Promise<{ [key: number]: Tv }>;
async function from_async<Tv>(
  dict: Readonly<{
    [key: symbol]: Promise<Tv>;
  }>
): Promise<{ [key: symbol]: Tv }>;
async function from_async<Tv>(
  dict: Readonly<{
    [key: string | number | symbol]: Promise<Tv>;
  }>
): Promise<{ [key: string | number | symbol]: Tv }> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(dict).map(async ([key, valueAsync]) => [
        key,
        await valueAsync,
      ])
    )
  );
}

/**
 * @returns a new mapper-obj where each value is the result of calling the given
 * async function on the corresponding key.
 *
 * @see `Dict.from_keys` for non-async functions
 */
async function from_keys_async<Tk extends keyof any, Tv>(
  arr: readonly Tk[],
  asyncFunc: (key: Tk) => Promise<Tv>
): Promise<Readonly<Record<Tk, Tv>>>;
async function from_keys_async<Tv>(
  arr: readonly string[],
  asyncFunc: (key: string) => Promise<Tv>
): Promise<Readonly<{ [key: string]: Tv }>>;
async function from_keys_async<Tv>(
  arr: readonly number[],
  asyncFunc: (key: number) => Promise<Tv>
): Promise<Readonly<{ [key: number]: Tv }>>;
async function from_keys_async<Tv>(
  arr: readonly symbol[],
  asyncFunc: (key: symbol) => Promise<Tv>
): Promise<Readonly<{ [key: symbol]: Tv }>>;
async function from_keys_async<Tv>(
  arr: readonly (string | number | symbol)[],
  asyncFunc: (key: any) => Promise<Tv>
): Promise<Readonly<{ [key: string | number | symbol]: Tv }>> {
  return Object.fromEntries(
    await Promise.all(arr.map(async (key) => [key, await asyncFunc(key)]))
  );
}

/**
 * @returns a new mapper-obj containing only the values for which the given
 * async predicate returns `true`.
 *
 * @see `Dict\filter()` for non-async predicates.
 */
async function filter_async<Tk extends keyof any, Tv>(
  dict: Readonly<Record<Tk, Tv>>,
  valuePredicate: (key: Tk) => Promise<boolean>
): Promise<Readonly<Record<Tk, Tv>>>;
async function filter_async<Tv>(
  dict: Readonly<{ [key: string]: Tv }>,
  valuePredicate: (key: string) => Promise<boolean>
): Promise<Readonly<{ [key: string]: Tv }>>;
async function filter_async<Tv>(
  dict: Readonly<{ [key: number]: Tv }>,
  valuePredicate: (key: number) => Promise<boolean>
): Promise<Readonly<{ [key: number]: Tv }>>;
async function filter_async<Tv>(
  dict: Readonly<{ [key: symbol]: Tv }>,
  valuePredicate: (key: symbol) => Promise<boolean>
): Promise<Readonly<{ [key: symbol]: Tv }>>;
async function filter_async<Tv>(
  dict: Readonly<{ [key: string | number | symbol]: Tv }>,
  valuePredicate: (key: any) => Promise<boolean>
): Promise<Readonly<{ [key: string | number | symbol]: Tv }>> {
  return Object.fromEntries(
    (
      await Promise.all(
        Object.entries(dict).map(async ([key, value]) => [
          key,
          value,
          await valuePredicate(value),
        ])
      )
    ).filter(([, , isEnabled]) => isEnabled)
  );
}

export const Dict = {
  from_async,
  from_keys_async,
  filter_async,
} as const;
