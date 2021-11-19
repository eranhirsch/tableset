export const isIndexType = (x: unknown): x is number =>
  typeof x === "number" && x >= 0;
