export const array_pick_random_item = <T>(
  /**
   * This interface is a very narrowed-down interface of arrays with just the
   * basic methods needed to pick a random value. We use it to create "fake"
   * arrays which could be computed on the fly.
   */
  arr: { length: number; at(index: number): T | undefined }
): T =>
  // Notice we force the value to be non-null, this is becase normally the `at`
  // method can return undefined if the index is out of range, but here we are
  // picking the index based on the array length. The only case where this could
  // break is when the arrray's implmentation is broken.
  arr.at(array_pick_random_index(arr))!;

export const array_pick_random_index = ({
  length,
}: {
  length: number;
}): number => Math.floor(Math.random() * length);