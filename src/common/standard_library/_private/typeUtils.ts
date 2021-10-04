export type PromisedType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : unknown;

export type DictLike<K extends keyof any = keyof any, V = any> =
  | Required<Record<K, V>>
  | Partial<Record<K, V>>;

export type ValueOf<T extends DictLike> = T extends Required<
  Record<keyof any, infer V>
>
  ? V
  : T extends Partial<Record<keyof any, infer V>>
  ? V
  : never;

export type RemappedDict<T extends DictLike, V> = T extends Required<
  Record<infer K, any>
>
  ? Required<Record<K, V>>
  : Partial<Record<keyof T, V>>;

export type RekeyedDict<
  T extends DictLike,
  K extends keyof any
> = T extends Required<Record<keyof any, infer V>>
  ? Required<Record<K, V>>
  : Partial<Record<K, ValueOf<T>>>;

export type TransformedDict<
  T extends DictLike,
  K extends keyof any,
  V
> = T extends Required<Record<keyof any, any>>
  ? Required<Record<K, V>>
  : Partial<Record<K, V>>;
