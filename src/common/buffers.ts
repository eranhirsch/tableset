const URL_SAFE: readonly (readonly [from: string, to: string])[] = [
  ["=", ""],
  ["/", "_"],
  ["+", "-"],
];

export const base64Url = {
  encode: (buffer: Buffer): string =>
    URL_SAFE.reduce(
      (out, [from, to]) => out.replace(from, to),
      buffer.toString("base64")
    ),

  decode: (encoded: string): Buffer =>
    Buffer.from(
      URL_SAFE.reduce((out, [to, from]) => out.replace(from, to), encoded),
      "base64"
    ),
} as const;
