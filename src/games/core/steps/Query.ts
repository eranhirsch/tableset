export interface Query<T> {
  canResolveTo(value: T): boolean;
  maxCount(max: number): boolean;
  minCount(min: number): boolean;
  willResolve(): boolean;
}
