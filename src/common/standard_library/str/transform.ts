/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/str/transform.php
 */

const capitalize = (s: string, locales?: string | string[]): string =>
  s[0].toLocaleUpperCase(locales) + s.slice(1);

const capitalize_words = (s: string, delimiter: string = " "): string =>
  s
    // TODO: We should support multiple delimiters and then glue the string back
    // using them.
    .split(delimiter)
    .map((word) => capitalize(word))
    .join(delimiter);

export const Str = {
  capitalize,
  capitalize_words,
} as const;
