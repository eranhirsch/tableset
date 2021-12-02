import { invariant, MathUtils as MU, tuple, Vec } from "common";

export type CombinationsLazyArray<T> = Omit<
  CombinationsLazyArrayWithDuplicates<T>,
  "asCanonicalIndex"
>;

const combinations_lazy_array = <T>(
  pool: readonly T[],
  k: number,
  skipSorting: boolean = false
): CombinationsLazyArray<T> =>
  new CombinationsLazyArrayWithDuplicates(
    pool,
    k,
    false /* withDuplicates */,
    skipSorting
  );

const combinations_lazy_array_with_duplicates = <T>(
  pool: readonly T[],
  k: number
): CombinationsLazyArrayWithDuplicates<T> =>
  new CombinationsLazyArrayWithDuplicates(pool, k, true /* withDuplicates */);

export class CombinationsLazyArrayWithDuplicates<T> {
  private readonly pool: readonly T[];

  constructor(
    pool: readonly T[],
    public readonly k: number,
    private readonly withDuplicates: boolean = false,
    skipSorting: boolean = false
  ) {
    // We normalize the item definition for use in our algorithm
    this.pool = skipSorting ? pool : Vec.sort(pool);

    invariant(
      withDuplicates ||
        !this.pool.some((item, index) => item === this.pool[index + 1]),
      `Pool ${pool} contains duplicates, use '_with_duplicates' instead to ignore them`
    );
  }

  get n(): number {
    return this.pool.length;
  }

  get length(): number {
    return MU.combinations(this.n, this.k);
  }

  /**
   * Get the `i`th combination in our ordering. Notice that this method builds
   * a new copy of the result and doesn't use any memoization. Calling it twice
   * would run the building logic twice.
   * For every legal combination `x`: `at(indexOf(x)) === x`
   * @param index an integer, use negative to go in reverse from the end of the
   * array
   * @returns a combination, or undefined if the index is out of range.
   */
  at(index: number): readonly T[] | undefined {
    invariant(
      Number.isInteger(index),
      `Only integer numbers are supported: ${index}`
    );

    // Array.at() supports negative numbers as a way to go "back" in a list
    index = index >= 0 ? index : this.length + index;

    if (index > this.length) {
      // As defined for Array.at()
      return undefined;
    }

    // We compute the combination by treating each element in the output
    // combination as a "digit" computed in the radix which is the number of
    // possible combinations _after_ that digit. We then continue iteratively
    // until we've found enough digits.
    // Another way of looking at it is that for each element, when we use it we
    // will also use it for the next C(n-1, k-1) combinations so if the value
    // falls within that number it means that element is part of the output.
    const [combination, remainingIndex] = this.pool.reduce(
      ([combination, currentIndex], element, offset) => {
        if (combination.length === this.k) {
          // We can skip any computation on the remaining elements as we already
          // found the full combination.
          return tuple(combination, currentIndex);
        }

        const radix = MU.combinations(
          this.pool.length - offset - 1,
          this.k - combination.length - 1
        );

        if (currentIndex >= radix) {
          // If the current index is bigger than the radix then this "digit" was
          // not "part of" the encoding. We continue by removing that amount
          // from the ongoing number we are using to compute the permutation and
          // continuing to the next possible element.
          return tuple(combination, currentIndex - radix);
        }

        // If the current index is smaller than the radix it means this digit
        // is part of the output so we add it, and continue to the next element,
        // using the same ongoing index, as it is now relevant for the next
        // element too.
        return tuple(Vec.concat(combination, element), currentIndex);
      },
      [[], index] as [combination: readonly T[], index: number]
    );

    invariant(
      remainingIndex === 0,
      `Remaining index ${remainingIndex} is not 0 for index ${index}`
    );

    return combination;
  }

  /**
   * Checks that the permutation could be built using this definition. This is
   * cheaper than calling `indexOf`.
   */
  includes(combination: readonly T[]): boolean {
    return Vec.is_contained_in(combination, this.pool);
  }

  /**
   * The index of this permutation in the list of all permutations supported by
   * this definition. Can also be considered the encoding of the permutation.
   * For every `x` in [0..length]: `indexOf(at(x)) === x`;
   * @param permutation
   * @returns integer in the range [0..length] or -1 if the permutation is not
   * buildable by this definition.
   */
  indexOf(combination: readonly T[]): number {
    if (!this.includes(combination)) {
      // By definition of Array.indexOf()
      return -1;
    }

    const [leftover, index] = this.pool.reduce(
      ([combination, index], element, offset) => {
        if (Vec.is_empty(combination)) {
          return tuple(combination, index);
        }

        const [nextCombinationElement, ...restOfCombination] = combination;
        if (element === nextCombinationElement) {
          return tuple(restOfCombination, index);
        }

        return tuple(
          combination,
          index +
            MU.combinations(
              this.pool.length - offset - 1,
              combination.length - 1
            )
        );
      },
      [Vec.sort_by(combination, (item) => this.pool.indexOf(item)), 0] as [
        combination: readonly T[],
        index: number
      ]
    );

    invariant(
      Vec.is_empty(leftover),
      `Some of the combination ${combination} wasn't parsed: ${leftover}`
    );

    return index;
  }

  asCanonicalIndex(index: number): number {
    invariant(
      this.withDuplicates,
      `Canonical indexes are only defined for combinations with duplicates!`
    );
    const atIndex = this.at(index);
    return atIndex == null ? index : this.indexOf(atIndex);
  }

  toString(): string {
    return `${this.constructor.name}${JSON.stringify(this.pool)}`;
  }
}

export const MathUtils = {
  combinations_lazy_array,
  combinations_lazy_array_with_duplicates,
} as const;
