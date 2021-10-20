import { Vec } from "common";

/**
 * Copied from an answer on StackOverflow and modernized
 * @returns the same hashCode the string would get from running the Java
 * `hashCode` method on it.
 * @see https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
const javaHashCode = (str: string): number =>
  Vec.map(Vec.range(0, str.length - 1), (index) =>
    str.charCodeAt(index)
  ).reduce((hash, charCode) => ((hash << 5) - hash + charCode) | 0, 0);

export const Num = {
  javaHashCode,
} as const;
