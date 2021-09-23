/**
 * A set of helper methods for working with raw JS Arrays and "mapper-style"
 * key-value objects. To prevent confusion and name clashes we use Vec and Dict
 * for those respective data structures (instead of Array and Object).
 *
 * We consider inputs as immutable so most methods would return a new object,
 * or the same object in case there are no changes (making it safe to use with
 * React state)
 *
 * This whole module is inspired heavily by Hack Standard Library
 * @see https://docs.hhvm.com/hsl/reference/
 */

export * from "./c";
export * from "./vec";
export * from "./dict";
export * from "./tuple";
export * from "./random_offset";
export * from "./object_filter";
export * from "./object_flip";
export * from "./object_map_with_key";
export * from "./object_map";
export * from "./object_pull_with_key";
export * from "./range";
