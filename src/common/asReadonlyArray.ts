import { asInteger } from "./asInteger";

interface Indexable<T> {
  length: number;
  at(index: number): T | undefined;
}

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
  return asIndex != null
    ? target.at(asIndex)
    : Reflect.get(target, property, receiver);
}
