/**
 * @see https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
 */
import { invariant } from "./err/invariant";

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/",
] as const;

export function encode(x: number): string {
  invariant(x >= 0, `Can't encode negative value ${x}`);

  let lo = x >>> 0;
  let hi = (x / 2 ** 32) >>> 0;

  let right = "";
  while (hi > 0) {
    right = ALPHABET[0x3f & lo] + right;
    lo >>>= 6;
    lo |= (0x3f & hi) << 26;
    hi >>>= 6;
  }

  let left = "";
  do {
    left = ALPHABET[0x3f & lo] + left;
    lo >>>= 6;
  } while (lo > 0);

  return left + right;
}

export function decode(x: string): number {
  const lookupTable = getBinaryLookupTable();

  let number = 0;
  for (let i = 0; i < x.length; i++) {
    number = number * ALPHABET.length + lookupTable[x.charCodeAt(i)];
  }

  return number;
}

export default { encode, decode } as const;

let binaryLookupTableMemoized: number[] | undefined;
function getBinaryLookupTable(): number[] {
  if (binaryLookupTableMemoized == null) {
    // string to binary lookup table
    // 123 == 'z'.charCodeAt(0) + 1
    binaryLookupTableMemoized = new Array(123);
    for (let i = 0; i < ALPHABET.length; i++) {
      binaryLookupTableMemoized[ALPHABET[i].charCodeAt(0)] = i;
    }
  }
  return binaryLookupTableMemoized;
}
