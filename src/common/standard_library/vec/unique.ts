export namespace Vec {
  export function unique<Tv>(arr: Tv[]): Tv[] {
    // We create the de-dupped result aside, so we can compare length and return
    // a new object only if the value changed, this makes it safe for use with
    // React state.
    const newArr = [...new Set(arr)];
    return newArr.length === arr.length ? arr : newArr;
  }
}
