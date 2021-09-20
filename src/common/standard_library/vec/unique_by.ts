export namespace Vec {
  /**
   * Returns a new array containing each element of the given array exactly
   * once, where uniqueness is determined by calling the given scalar function
   * on the values.
   *
   * In case of duplicate scalar keys, later values will overwrite previous
   * ones.
   *
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
}
