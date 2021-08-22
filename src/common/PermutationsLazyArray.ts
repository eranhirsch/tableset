import invariant from "./err/invariant";

export default class PermutationsLazyArray<K extends keyof any> {
  private static readonly PRECOMP_FACT: ReadonlyArray<number> = [
    0, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600,
    6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000,
    6402373705728000,
  ];

  private readonly itemDefinition: ReadonlyArray<readonly [K, number]>;

  public constructor(itemDefinition: Record<K, number>) {
    // We normalize the item definition for use in our algorithm.
    this.itemDefinition = Object.entries(itemDefinition)
      .map(([a, b]) => [a, b] as [K, number])
      .sort(([a], [b]) => (a === b ? 0 : a < b ? -1 : 1));

    invariant(
      this.permutationLength < PermutationsLazyArray.PRECOMP_FACT.length,
      `Too many items in definition ${this} (${this.permutationLength}). Max ${PermutationsLazyArray.PRECOMP_FACT.length} items supported`
    );
  }

  public at(index: number): K[] {
    invariant(index >= 0, `Negative index ${index} is undefined`);
    invariant(
      index <= this.length,
      `Index ${index} is out of range for defintion ${this}`
    );

    let remainingItems = this.itemsDefinitionMutableCopy();
    let premutation: K[] = [];
    while (remainingItems.length > 0) {
      const itemIdx = index % remainingItems.length;
      index = Math.floor(index / remainingItems.length);
      premutation.push(remainingItems[itemIdx][0]);
      PermutationsLazyArray.decrementIndex(remainingItems, itemIdx);
    }

    return premutation;
  }

  public indexOf(permutation: K[]): number {
    invariant(
      permutation.length === this.permutationLength,
      `Permutation ${permutation} is not valid for definition ${this}`
    );

    const items: Record<K, number> = permutation.reduce((items, item) => {
      items[item] = (items[item] ?? 0) + 1;
      return items;
    }, {} as Record<K, number>);
    invariant(
      this.itemDefinition.every(([item, count]) => items[item] === count),
      `Permutation ${permutation} does not contain the expected items per definition ${this}`
    );

    let remainingItems = this.itemsDefinitionMutableCopy();
    return permutation
      .map((item) => {
        const idx = remainingItems.findIndex(([x]) => item === x);
        invariant(idx >= 0, `Couldn't find item in the remainig items`);
        const prevRemaining = remainingItems.length;
        PermutationsLazyArray.decrementIndex(remainingItems, idx);
        return [idx, prevRemaining];
      })
      .reverse()
      .reduce((accum, [digit, remaining]) => accum * remaining + digit, 0);
  }

  public toString(): string {
    return `${this.constructor.name}[${this.itemDefinition
      .map(([item, count]) => `${item}:${count}`)
      .join(", ")}]`;
  }

  public get length(): number {
    return (
      PermutationsLazyArray.PRECOMP_FACT[this.permutationLength] /
      this.itemDefinition.reduce(
        (duplicationFactor, [_, count]) =>
          duplicationFactor * PermutationsLazyArray.PRECOMP_FACT[count],
        // notice that we multiply, so start with 1, and not 0
        1
      )
    );
  }

  private get permutationLength(): number {
    return this.itemDefinition.reduce((sum, [_, count]) => sum + count, 0);
  }

  private itemsDefinitionMutableCopy(): [K, number][] {
    return this.itemDefinition.map((x) => [...x]);
  }

  /**
   * Decrements the index in place, and removes items that reached 0
   * @param arr
   * @param idx
   */
  private static decrementIndex(arr: [unknown, number][], idx: number): void {
    if (arr[idx][1] === 1) {
      arr.splice(idx, 1);
    } else {
      arr[idx][1] -= 1;
    }
  }
}
