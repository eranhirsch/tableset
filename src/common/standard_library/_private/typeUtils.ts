export type PromisedType<P> = P extends Promise<infer T> ? T : never;

export type ValueOf<T> = T extends Record<keyof any, any> ? T[keyof T] : never;

export type DictLike = Record<keyof any, any>;
