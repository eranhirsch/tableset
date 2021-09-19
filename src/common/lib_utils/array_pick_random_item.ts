type RandomAccessArray<T> =
  // For regular JS arrays
  | { [index: number]: T | undefined }
  // This interface allows creating lazy arrays which compute values at indexes
  // on-the-fly.
  | { at(index: number): T | undefined };

export const array_pick_random_item = <T>(
  /**
   * This interface is a very narrowed-down interface of arrays with just the
   * basic methods needed to pick a random value.
   */
  arr: { length: number } & RandomAccessArray<T>
): T =>
  // Notice we force the value to be non-null, this is becase normally the `at`
  // method can return undefined if the index is out of range, but here we are
  // picking the index based on the array length. The only case where this could
  // break is when the arrray's implmentation is broken.
  ("at" in arr ? arr.at(random_offset(arr)) : arr[random_offset(arr)])!;

export const random_offset = ({ length }: { length: number }): number =>
  Math.floor(Math.random() * length);
