import { asInteger } from "./asInteger";

type Indexable<T> = Partial<ReadonlyArray<T>> & {
  at(index: number): T | undefined;
};

export const asReadonlyArray = <T>(indexable: Indexable<T>): readonly T[] =>
  new Proxy(indexable, {
    get: readonlyArrayGetWrapper,
  }) as unknown as readonly T[];

function readonlyArrayGetWrapper<T>(
  target: Indexable<T>,
  property: string | symbol,
  receiver: any
) {
  const asIndex = asInteger(property);
  if (asIndex != null) {
    return target.at(asIndex);
  }

  if (property === "indexOf" && target.indexOf == null) {
    return (searchElement: T, fromIndex: number = 0) => {
      for (let i = fromIndex; i < target.length; i++) {
        if (target.at(i) === searchElement) {
          return i;
        }
      }
      return -1;
    };
  }

  if (property === "findIndex" && target.findIndex == null) {
    return (
      predicate: (element: T, index: number, array: readonly T[]) => boolean
    ) => {
      for (let i = 0; i < target.length; i += 1) {
        if (predicate(target.at(i)!, i, receiver)) {
          return i;
        }
      }
      return -1;
    };
  }

  if (property === "find" && target.find == null) {
    return (
      predicate: (element: T, index: number, array: readonly T[]) => boolean
    ) => {
      for (let i = 0; i < target.length; i++) {
        const element = target.at(i)!;
        if (predicate(element, i, receiver)) {
          return element;
        }
      }
      return;
    };
  }

  if (property === "filter" && target.filter == null) {
    return (
      predicate: (value: T, index: number, array: readonly T[]) => unknown,
      thisArg?: any
    ): T[] => {
      const result = [];
      for (let i = 0; i < target.length; i++) {
        const value = target.at(i)!;
        if (predicate(value, i, receiver)) {
          result.push(value);
        }
      }
      return result;
    };
  }

  if (property === "map" && target.map == null) {
    return (
      callbackfn: (value: T, index: number, array: T[]) => unknown
    ): unknown[] => {
      const result = [];
      for (let i = 0; i < target.length; i++) {
        result.push(callbackfn(target.at(i)!, i, receiver));
      }
      return result;
    };
  }

  if (property === "forEach" && target.forEach == null) {
    return (
      callbackfn: (value: T, index: number, array: readonly T[]) => void,
      thisArg?: any
    ): void => {
      for (let i = 0; i < target.length; i++) {
        callbackfn(target.at(i)!, i, receiver);
      }
    };
  }

  Reflect.get(target, property, receiver);
}
