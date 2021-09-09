/**
 * Take an object-mapper and flip the keys and values
 * @param x input object-mapper
 */
export default function object_flip(x: { [key: number]: number }): {
  [key: number]: number;
};
export default function object_flip(x: { [key: string]: string }): {
  [key: string]: string;
};
export default function object_flip(x: { [key: number]: string }): {
  [key: string]: number;
};
export default function object_flip(x: { [key: string]: number }): {
  [key: number]: string;
};
export default function object_flip(x: {
  [key: string | number]: string | number;
}): {
  [key: string | number]: string | number;
} {
  return Object.fromEntries(
    Object.entries(x).map(([key, value]) => [value, key])
  );
}
