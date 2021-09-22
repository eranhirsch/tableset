/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/divide.php
 */

/**
 * @returns a 2-tuple containing arrays for which the given predicate returned
 * true and false, respectively
 *
 * Trivial results (all true/false) will return the input array in the tuple.
 *
 * @see `Vec.partition_async`
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.partition/
 */
function partition<Tv>(
  arr: readonly Tv[],
  valuePredicate: (item: Tv) => boolean
): readonly [readonly Tv[], readonly Tv[]] {
  const results = arr.map((item) => valuePredicate(item));

  // React optimizations to return the input array for trivial results:
  if (results.every((isEnabled) => isEnabled)) {
    // Only true returned.
    return [arr, []];
  }

  if (results.every((isEnabled) => !isEnabled)) {
    // Only false returned.
    return [[], arr];
  }

  // Do the actual partitioning
  return results.reduce(
    (out, isEnabled, index) => {
      out[isEnabled ? 0 : 1].push(arr[index]);
      return out;
    },
    [[], []] as [Tv[], Tv[]]
  );
}

export const Vec = {
  partition,
} as const;
