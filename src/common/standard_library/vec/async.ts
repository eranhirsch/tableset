/**
 * Ported (manually) from HSL.
 *
 * Methods not needed in JS:
 * * `from_async` === `Promise.all`
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/async.php
 */

/**
 * @returns an array containing only the values for which the given async
 * predicate returns true
 *
 * @see `Array.filter` for non-async predicates
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.filter_async/
 */
async function filter_async<Tv>(
  arr: Tv[],
  predicate: (item: Tv) => Promise<boolean>
): Promise<Tv[]> {
  const resolved = await Promise.all(arr.map((item) => predicate(item)));
  if (resolved.every((isEnabled) => isEnabled)) {
    return arr;
  }
  return arr.filter((_, index) => resolved[index]);
}

/**
 * @returns a new array where each value is the result of calling the given
 * async function on the original value.
 *
 * @see `Array.map` for non-async functions.
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.map_async/
 */
const map_async = async <Tv1, Tv2>(
  arr: readonly Tv1[],
  asyncFunc: (item: Tv1) => Promise<Tv2>
): Promise<Tv2[]> => Promise.all(arr.map((item) => asyncFunc(item)));

/**
 * @returns a 2-tuple containing arrays for which the given async predicate
 * returned true and false, respectively.
 *
 * Trivial results (all true/false) will return the input array in the tuple.
 *
 * @see `Vec.partition` for non-async version
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.partition_async/
 */
async function partition_async<Tv>(
  arr: Tv[],
  valuePredicate: (item: Tv) => Promise<boolean>
): Promise<[Tv[], Tv[]]> {
  const resolved = await Promise.all(arr.map((item) => valuePredicate(item)));

  // React optimizations to return the input array for trivial results:
  if (resolved.every((isEnabled) => isEnabled)) {
    // Only true returned.
    return [arr, []];
  }

  if (resolved.every((isEnabled) => !isEnabled)) {
    // Only false returned.
    return [[], arr];
  }

  // Do the actual partitioning
  return resolved.reduce(
    (out, isEnabled, index) => {
      out[isEnabled ? 0 : 1].push(arr[index]);
      return out;
    },
    [[], []] as [Tv[], Tv[]]
  );
}

export const Vec = {
  filter_async,
  map_async,
  partition_async,
} as const;
