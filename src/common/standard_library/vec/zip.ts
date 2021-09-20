export namespace Vec {
  /**
   * Returns an array where each element is a tuple (pair) that combines,
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
