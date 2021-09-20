import { range as rangeIter, random_offset } from "common";

type RandomAccessArray<T> =
  // For regular JS arrays
  | { [index: number]: T | undefined }
  // This interface allows creating lazy arrays which compute values at indexes
  // on-the-fly.
  | { at(index: number): T | undefined };

export namespace Vec {
  export const random_item = <Tv>(
    /**
     * This interface is a very narrowed-down interface of arrays with just the
     * basic methods needed to pick a random value.
     */
    arr: { length: number } & RandomAccessArray<Tv>
  ): Tv =>
    // Notice we force the value to be non-null, this is because normally the `at`
    // method can return undefined if the index is out of range, but here we are
    // picking the index based on the array length. The only case where this could
    // break is when the array's implementation is broken.
    ("at" in arr ? arr.at(random_offset(arr)) : arr[random_offset(arr)])!;

  //////////////////////////////////////////////////////////////////////////////
  /////////////////////// Ported from HSL     //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /**
   * Methods not needed in JS:
   * * `concat` === `Array.concat`
   * * `drop` === `Array.slice`
   * * `filter` === `Array.filter`
   * * `flatten` === `Array.flat`
   * * `from_async` === `Promise.all`
   * * `map` === `Array.map`
   * * `reverse` === `Array.reverse`
   * * `slice` === `Array.slice` (technically slice will always return a NEW array
   * and we can consider a version more suitable for react where it would return
   * the SAME array if the indices used mean returning the same array:
   * `arr.slice(0, >length)`)
   */

  /**
   * @returns an array containing the original vec split into chunks of the
   * given size.
   *
   * If the original vec doesn't divide evenly, the final chunk will be smaller.
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.chunk/
   */
  export const chunk = <Tv>(arr: readonly Tv[], size: number): Tv[][] =>
    arr.reduce(
      (out, item) => {
        let lastChunk = out[out.length - 1];
        if (lastChunk.length >= size) {
          lastChunk = [];
          out.push(lastChunk);
        }
        lastChunk.push(item);
        return out;
      },
      [[]] as Tv[][]
    );

  /**
   * @returns an array containing only the elements of the first array that do
   * not appear in any of the other ones.
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.diff/
   */
  export function diff<Tv>(
    first: Tv[],
    ...rest: [readonly Tv[], ...(readonly Tv[])[]]
  ): Tv[] {
    const filtered = first.filter(
      (item) => !rest.some((otherArray) => otherArray.includes(item))
    );
    return filtered.length < first.length ? filtered : first;
  }

  /**
   * @returns an array containing only the elements of the first array that do
   * not appear in the second one, where an element's identity is determined by
   * the scalar function
   *
   * @see `Vec.diff`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.diff_by/
   */
  export function diff_by<Tv, Ts>(
    first: Tv[],
    second: readonly Tv[],
    scalarFunc: (value: Tv) => Ts
  ): Tv[] {
    const secondScalars = second.map((item) => scalarFunc(item));
    const filtered = first.filter(
      (item) => !secondScalars.includes(scalarFunc(item))
    );
    return filtered.length < first.length ? filtered : first;
  }

  /**
   * @returns a new array of size `size` where all the values are `value`
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.fill/
   */
  export const fill = <Tv>(size: number, value: Tv): Tv[] =>
    new Array(size).fill(value);

  /**
   * @returns an array containing only the values for which the given async
   * predicate returns true
   *
   * @see `Array.filter` for non-async predicates
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.filter_async/
   */
  export async function filter_async<Tv>(
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
   * @returns an array containing only non-null values of the given array.
   */
  export function filter_nulls<Tv>(arr: (Tv | null | undefined)[]): Tv[] {
    // The best way to filter nulls in TS? (August 2021)
    const filtered = arr.flatMap((x) => (x == null ? [] : [x]));
    return filtered.length < arr.length ? filtered : (arr as Tv[]);
  }

  /**
   * @returns a new array containing only the values for which the given
   * predicate returns true.
   *
   * If you don't need access to the key, see Vec\filter().
   *
   * @see `Array.filter`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.filter_with_key/
   */
  export function filter_with_key<Tk extends keyof any, Tv>(
    dict: Readonly<Partial<Record<Tk, Tv>>>,
    predicate: (key: Tk, value: Tv) => boolean
  ): Tv[];
  export function filter_with_key<Tv>(
    dict: Readonly<{ [key: string]: Tv }>,
    predicate: (key: string, value: Tv) => boolean
  ): Tv[];
  export function filter_with_key<Tv>(
    dict: Readonly<{ [key: number]: Tv }>,
    predicate: (key: number, value: Tv) => boolean
  ): Tv[];
  export function filter_with_key<Tv>(
    dict: Readonly<{ [key: symbol]: Tv }>,
    predicate: (key: symbol, value: Tv) => boolean
  ): Tv[];
  export function filter_with_key<Tv>(
    dict: Readonly<{ [key: keyof any]: Tv }>,
    predicate: (key: any, value: Tv) => boolean
  ): Tv[] {
    return Object.entries(dict)
      .filter(([key, value]) => predicate(key, value))
      .map(([, value]) => value);
  }

  /**
   * @returns an array containing only the elements of the first array that
   * appear in all the other ones.
   *
   * Duplicate values are preserved.
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.intersect/
   */
  export function intersect<Tv>(
    arr: Tv[],
    ...rest: [readonly Tv[], ...(readonly Tv[])[]]
  ): Tv[] {
    const intersection = arr.filter((item) =>
      rest.every((otherArray) => otherArray.includes(item))
    );
    // Optimize for react, return the input array if all items intersected
    return intersection.length < arr.length ? intersection : arr;
  }

  /**
   * @returns a new array containing the keys of the given mapper-object
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.keys/
   */
  export function keys<Tk extends keyof any>(
    dict: Readonly<Partial<Record<Tk, unknown>>>
  ): Tk[];
  export function keys(dict: Readonly<{ [key: string]: unknown }>): string[];
  export function keys(dict: Readonly<{ [key: number]: unknown }>): number[];
  export function keys(dict: Readonly<{ [key: symbol]: unknown }>): symbol[];
  export function keys(
    dict: Readonly<{ [key: keyof any]: unknown }>
  ): unknown[] {
    return Object.keys(dict);
  }

  /**
   * @returns a new array where each value is the result of calling the given
   * async function on the original value.
   *
   * @see `Array.map` for non-async functions.
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.map_async/
   */
  export const map_async = async <Tv1, Tv2>(
    arr: readonly Tv1[],
    asyncFunc: (item: Tv1) => Promise<Tv2>
  ): Promise<Tv2[]> => Promise.all(arr.map((item) => asyncFunc(item)));

  /**
   * @returns a new array where each value is the result of calling the given
   * function on the original key and value.
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.map_with_key/
   */
  export function map_with_key<Tk extends keyof any, Tv1, Tv2>(
    dict: Readonly<Partial<Record<Tk, Tv1>>>,
    valueFunc: (key: Tk, value: Tv1) => Tv2
  ): Tv2[];
  export function map_with_key<Tv1, Tv2>(
    dict: Readonly<{ [key: string]: Tv1 }>,
    valueFunc: (key: string, value: Tv1) => Tv2
  ): Tv2[];
  export function map_with_key<Tv1, Tv2>(
    dict: Readonly<{ [key: number]: Tv1 }>,
    valueFunc: (key: number, value: Tv1) => Tv2
  ): Tv2[];
  export function map_with_key<Tv1, Tv2>(
    dict: Readonly<{ [key: symbol]: Tv1 }>,
    valueFunc: (key: symbol, value: Tv1) => Tv2
  ): Tv2[];
  export function map_with_key<Tv1, Tv2>(
    dict: Readonly<{ [key: keyof any]: Tv1 }>,
    valueFunc: (key: any, value: Tv1) => Tv2
  ): Tv2[] {
    return Object.entries(dict).map(([key, value]) => valueFunc(key, value));
  }

  /**
   * @returns a 2-tuple containing arrays for which the given predicate returned
   * true and false, respectively
   *
   * Trivial results (all true/false) will return the input array in the tuple.
   *
   * @see `Vec.partition_async`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.partition/
   */
  export function partition<Tv>(
    arr: Tv[],
    valuePredicate: (item: Tv) => boolean
  ): [Tv[], Tv[]] {
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

  /**
   * @returns a 2-tuple containing arrays for which the given async predicate
   * returned true and false, respectively.
   *
   * Trivial results (all true/false) will return the input array in the tuple.
   *
   * @see `Vec.partition` for non-async version
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.partition_async/
   */
  export async function partition_async<Tv>(
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

  /**
   * @returns a new array containing the range of numbers from start to end
   * inclusive, with the step between elements being step if provided, or 1 by
   * default.
   *
   * If start > end, it returns a descending range instead of an empty one.
   *
   * If you don't need the items to be enumerated, consider `Vec.fill`.
   *
   * @see `range`
   * @see `Vec.fill`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.range/
   */
  export const range = (
    start: number,
    end: number,
    step: number = 1
  ): number[] => Array.from(rangeIter(start, end + 1, step));

  /**
   * @returns an array containing an unbiased random sample of up to sampleSize
   * elements (fewer iff sampleSize is larger than the size of the array)
   *
   * The output array would maintain the same item order.
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sample/
   */
  export function sample<Tv>(arr: Tv[], sampleSize: number): Tv[] {
    if (sampleSize >= arr.length) {
      // Trivial solution
      return arr;
    }

    // To optimize the selection we can toggle between an include and exclude
    // logic for the sample; when sampleSize is small we will pick a set of
    // random indices and use them to pick elements from the input array, and
    // when sampleSize is big we will pick which indices to skip when rebuilding
    // the array.

    // We use a set so that we can ignore duplicates
    const selectedIndices: Set<number> = new Set();
    while (
      selectedIndices.size < Math.min(sampleSize, arr.length - sampleSize)
    ) {
      selectedIndices.add(random_offset(arr));
    }

    return sampleSize < arr.length - sampleSize
      ? [...selectedIndices].sort().map((index) => arr[index])
      : arr.filter((_, index) => !selectedIndices.has(index));
  }

  /**
   * @returns a new array with the values of the given array in a random order.
   *
   * Based on an answer in stackoverflow implementing the Fisher-Yates shuffle.
   *
   * @see https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
   * @see https://stackoverflow.com/a/2450976
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.shuffle/
   */
  export function shuffle<Tv>(arr: readonly Tv[]): Tv[] {
    const out = [...arr];
    for (const currentIndex of range(arr.length, 0)) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      [out[currentIndex - 1], out[randomIndex]] = [
        out[randomIndex],
        out[currentIndex - 1],
      ];
    }
    return out;
  }

  /**
   * @returns an array sorted by the values of the given array.
   *
   * If the optional comparator function isn't provided, the values will be
   * sorted in ascending order. The default comparator also treats
   * numbers as numbers (and not strings): sorting them by value and not by
   * lexical order.
   *
   * @see `Vec.sort_by`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sort/
   */
  export const sort = <Tv>(
    arr: Tv[],
    comparator: (a: Tv, b: Tv) => number = defaultComparator
  ) => sort_by(arr, (x) => x, comparator);

  /**
   * @returns an array sorted by some scalar property of each value of the given
   * array, which is computed by the given function.
   *
   * If the optional comparator function isn't provided, the values will be
   * sorted in ascending order of scalar key. The default comparator also treats
   * numbers as numbers (and not strings): sorting them by value and not by
   * lexical order.
   *
   * @see `Vec.sort`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sort_by/
   */
  export function sort_by<Tv, Ts>(
    arr: Tv[],
    scalar_func: (x: Tv) => Ts,
    comparator: (a: Ts, b: Ts) => number = defaultComparator
  ): Tv[] {
    const sorted = [...arr].sort((a, b) =>
      comparator(scalar_func(a), scalar_func(b))
    );
    // We optimize for React by checking that the sorted array is the same as
    // the input array, and in that case return the same object instead of a new
    // copy of it.
    return sorted.some((item, idx) => item !== arr[idx]) ? sorted : arr;
  }

  /**
   * @returns an array containing the first n elements of the given array.
   *
   * @see `Array.slice` for a more general way to create sub-arrays
   */
  export const take = <Tv>(arr: Tv[], n: number): Tv[] =>
    // We don't need to create a new array (which slice does implicitly) when
    // the number of elements we want to take is larger than the array itself.
    n < arr.length
      ? // Slice takes a start and a non-inclusive end, In order to return n
        // elements we need to go one further.
        arr.slice(0, n + 1)
      : arr;

  /**
   * @returns an array containing each element of the given array exactly
   * once.
   *
   * @see `Vec.unique_by`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.unique/
   */
  export function unique<Tv>(arr: Tv[]): Tv[] {
    // We create the de-dupped result aside, so we can compare length and return
    // a new object only if the value changed, this makes it safe for use with
    // React state.
    const newArr = [...new Set(arr)];
    return newArr.length === arr.length ? arr : newArr;
  }

  /**
   * @returns an array containing each element of the given array exactly
   * once, where uniqueness is determined by calling the given scalar function
   * on the values.
   *
   * In case of duplicate scalar keys, later values will overwrite previous
   * ones.
   *
   * @see `Vec.unique`
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.unique_by/
   */
  export function unique_by<Tv>(
    arr: Tv[],
    scalar_func: (item: Tv) => unknown
  ): Tv[] {
    const newArr = [
      ...arr
        .reduce(
          (out, item) => out.set(scalar_func(item), item),
          new Map<unknown, Tv>()
        )
        .values(),
    ];
    return arr.length === newArr.length ? arr : newArr;
  }

  /**
   * @returns an array where each element is a tuple (pair) that combines,
   * pairwise, the elements of the two given arrays.
   *
   * If the arrays are not of equal length, the result will have the same number
   * of elements as the shortest array. Elements of the longer Traversable after
   * the length of the shorter one will be ignored.
   *
   * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.zip/
   */
  export const zip = <Tv, Tu>(
    first: readonly Tv[],
    second: readonly Tu[]
  ): [Tv, Tu][] =>
    // The output length it limited to the shorter array. We can use slice for
    // this because if `first` is shorter slice wouldn't do anything here and
    // the output array length would be limited by the actual mapping method.
    first.slice(0, second.length).map((x, index) => [x, second[index]]);
}

function defaultComparator<K>(a: K, b: K): number {
  if (typeof a === "string" && typeof b === "string") {
    return a === b ? 0 : a < b ? -1 : 1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return defaultComparator(`${a}`, `${b}`);
}
