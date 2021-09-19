export interface RandomAccessArrayLike<T> {
  length: number;
  at(index: number): T | undefined;
}
