export type PromisedType<P> = P extends Promise<infer T> ? T : P;

export type ValueOf<T> = T[keyof T];
export type Entry<T> = readonly [key: keyof T, value: ValueOf<T>];
