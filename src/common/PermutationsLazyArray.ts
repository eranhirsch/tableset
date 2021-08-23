import invariant from "./err/invariant";
import invariant_violation from "./err/invariant_violation";

export default class PermutationsLazyArray<K extends keyof any> {
  // Factorials are expensive to compute so we precompute them for the whole
  // range of supported numbers for regular JS computations (2**53)
  private static readonly PRECOMP_FACT: ReadonlyArray<number> = [
    0, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600,
    6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000,
    6402373705728000,
  ];

  // See `combinations` below
  private static memoizedCombinations: Map<[number, number], number> =
    new Map();

  private readonly definition: ReadonlyArray<readonly [K, number]>;

  public constructor(itemDefinition: Readonly<Record<K, number>>) {
    // We normalize the item definition for use in our algorithm
    this.definition = Object.entries(itemDefinition)
      .map(([a, b]) => [a, b] as [K, number])
      .sort(([a], [b]) => (a === b ? 0 : a < b ? -1 : 1))
      .filter(([_, count]) => count > 0);

    invariant(
      this.definition.every(([_, count]) => Number.isInteger(count)),
      `definition ${itemDefinition} contains non-integer counts`
    );

    invariant(
      this.permutationLength < PermutationsLazyArray.PRECOMP_FACT.length,
      `Too many items in definition ${this} (${this.permutationLength}). MAX: ${PermutationsLazyArray.PRECOMP_FACT.length}`
    );
  }

  /**
   * Get the `i`th permutation in our ordering. Notice that this method builds
   * a new copy of the result and doesn't use any memoization. Calling it twice
   * would run the building logic twice.
   */
  public at(index: number): ReadonlyArray<K> | undefined {
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

    // We build the permutation by treating it as a representation of an integer
    // where the radixes change for each "digit" based on the number of
    // posibilities for that item in our definition.
    // IMPORTANT: This encoding is sensative to the order of our definition.
    return this.definition.reduceRight((permutation, [item, count]) => {
      // We start by computing how many positions (or slots) are available for
      // us to put the item (and extra copies of it).
      const availablePositions = permutation.length + 1;

      // Then we compute how many different ways we can fill those slots.
      const totalPlacements = PermutationsLazyArray.combinations(
        availablePositions,
        count
      );

      // We pick one of those possible combinations as a function of the current
      // index we are encoding. We are effectively finding out what "digit"
      // would represent it in our encoding.
      let comboIdx = index % totalPlacements;

      // We "encode" the number as the positions where the item would be in the
      // permutation
      PermutationsLazyArray.indexToPositions(
        comboIdx,
        count,
        availablePositions
      )
        // We are changing the permutation in-place so we need to insert the
        // items from least-significant backwards to that the offsets don't
        // change (they were computed based on the permutation before inserts).
        .reverse()
        .forEach((pos) => permutation.splice(pos, 0, item));

      // Remove the "radix" from the total number we are encoding, the rest of
      // the items would continue encoding the more-significant parts
      index = Math.floor(index / totalPlacements);

      return permutation;
    }, [] as K[]);
  }

  /**
   * Checks that the permutation could be built with the provided definition
   */
  public includes(permutation: ReadonlyArray<K>): boolean {
    return (
      // All permutations are of an expected length
      permutation.length === this.permutationLength &&
      // And there make is defined by the item definition
      this.definition.every(
        ([item, count]) =>
          permutation.filter((x) => x === item).length === count
      )
    );
  }

  public indexOf(permutation: ReadonlyArray<K>): number {
    if (!this.includes(permutation)) {
      // By definition of Array.indexOf()
      return -1;
    }

    const remaining = [...permutation];

    return (
      this.definition
        .reduce((parts, [item, count]) => {
          // Find all positions of the item.
          const positions = PermutationsLazyArray.extractItemFromArray(
            item,
            remaining
          );
          invariant(
            positions.length === count,
            `Permutation ${permutation} didn't have enough copies of ${item}`
          );

          // We care about the number of "slots" the remaining permutation has as
          // that is what the `at()` method saw when it came to insert the items.
          const availablePositions = remaining.length + 1;

          // Convert the positions vector back into an index, this is the "digit"
          // for this item, as encoded by `at()`
          const index = PermutationsLazyArray.positionsToIndex(
            positions,
            count,
            availablePositions
          );

          // And we compute the "radix" for the digit so we can reconstruct the
          // complete number with it. This is the total number of possible values
          // that `index` above could have been computed too.
          const totalPlacements = PermutationsLazyArray.combinations(
            availablePositions,
            count
          );

          invariant(
            index <= totalPlacements,
            `For permutation ${permutation} we calculated the index ${index} for item ${item} but expected max index is ${totalPlacements}`
          );

          // Add the "digit" and "radix" to our output array
          return parts.concat([[index, totalPlacements]]);
        }, [] as ReadonlyArray<[number, number]>)
        // Finally go over all digits and build the index incrementally digit by
        // digit from most significant to least significant.
        .reduce((index, [digit, radix]) => index * radix + digit, 0)
    );
  }

  /**
   * Remove all occurrences of the item from the array and return an array of
   * positions of the array without the item where those items were previously
   * at. Notice that the result might contain duplicates!
   * @param item in the item to extract from the list
   * @param remaining inout the list we are extracting the item from. Changes
   * are done in-place!
   * @returns a list of positions where the item was extracted from
   */
  private static extractItemFromArray<K>(item: K, remaining: K[]): number[] {
    const positions: number[] = [];

    while (remaining.length > 0) {
      const pos = remaining.indexOf(item);
      if (pos === -1) {
        break;
      }
      positions.push(pos);
      remaining.splice(pos, 1);
    }

    return positions;
  }

  public toString(): string {
    return `${this.constructor.name}[${this.definition
      .map(([item, count]) => `${item}:${count}`)
      .join(", ")}]`;
  }

  public get length(): number {
    return (
      PermutationsLazyArray.PRECOMP_FACT[this.permutationLength] /
      this.definition.reduce(
        (duplicationFactor, [_, count]) =>
          duplicationFactor * PermutationsLazyArray.PRECOMP_FACT[count],
        // notice that we multiply, so start with 1, and not 0
        1
      )
    );
  }

  private get permutationLength(): number {
    return this.definition.reduce((sum, [_, count]) => sum + count, 0);
  }

  private static indexToPositions(
    x: number,
    copies: number,
    digits: number
  ): number[] {
    const positions: number[] = [];

    for (let i = 0; i < copies; i += 1) {
      const lastPos = positions[positions.length - 1] ?? 0;
      const [msb, total] = PermutationsLazyArray.msb(
        x,
        digits - lastPos,
        copies - i
      );
      positions.push(msb + lastPos);
      x -= total;
    }

    return positions;
  }

  private static positionsToIndex(
    positions: number[],
    copies: number,
    digits: number
  ): number {
    let sum = 0;
    for (let pos = 0; pos < copies - 1; pos += 1) {
      const lowestDigit = positions[pos - 1] ?? 0;
      for (let digit = lowestDigit; digit < positions[pos]; digit += 1) {
        sum += PermutationsLazyArray.combinations(
          digits - digit,
          copies - pos - 1
        );
      }
    }
    return sum + positions[copies - 1] - (positions[copies - 2] ?? 0);
  }

  private static msb(
    x: number,
    digits: number,
    length: number
  ): [number, number] {
    if (length === 1) {
      invariant(
        x < digits,
        `Number ${x} is too big to be presented with ${digits} digits`
      );
      return [x, 0];
    }

    let smallerCombinations = 0;
    for (let digit = 0; digit < digits; digit += 1) {
      const combinationsForRemainingDigits = PermutationsLazyArray.combinations(
        digits - digit,
        length - 1
      );
      if (x < smallerCombinations + combinationsForRemainingDigits) {
        return [digit, smallerCombinations];
      }
      smallerCombinations += combinationsForRemainingDigits;
    }

    invariant_violation(
      `Number ${x} is too big to be represented with ${digits} digits and length ${length}`
    );
  }

  /**
   * The number of ways K (unmarked) balls can be put into N ordered cells.
   * @param n number of cells/slots/labels
   * @param k number of copies we have of the item we want to assign to cells
   * @returns f(n, 1) = n, f(n, k) = sum(f(i, k - 1) for i in [1..n])
   */
  private static combinations(n: number, k: number): number {
    if (k === 1) {
      return n;
    }

    if (n === 1) {
      // Optimization
      return 1;
    }

    const memoized = this.memoizedCombinations.get([n, k]);
    if (memoized != null) {
      // We use memoization to save on redundant computations
      return memoized;
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += this.combinations(i, k - 1);
    }

    this.memoizedCombinations.set([n, k], sum);

    return sum;
  }
}
