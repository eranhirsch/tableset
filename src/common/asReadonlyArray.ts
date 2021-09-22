import { asInteger } from "./asInteger";

type Indexable<T> = {
  readonly length: number;
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

  if (property === "indexOf") {
    return (searchElement: T, fromIndex: number = 0) => {
      for (let i = fromIndex; i < target.length; i++) {
        if (target.at(i) === searchElement) {
          return i;
        }
      }
      return -1;
    };
  }

  if (property === "findIndex") {
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

  if (property === "find") {
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

  if (property === "filter") {
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

  if (property === "map") {
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

  if (property === "forEach") {
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
