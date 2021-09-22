/**
 * New methods not part of the HSL
 */
import { random_offset } from "common";

type RandomAccessArray<T> =
  // For regular JS arrays
  | { [index: number]: T | undefined }
  // This interface allows creating lazy arrays which compute values at indexes
  // on-the-fly.
  | { at(index: number): T | undefined };

const random_item = <Tv>(
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

export const Vec = {
  random_item,
} as const;
