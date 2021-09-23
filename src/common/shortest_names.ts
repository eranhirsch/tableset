import { Str, tuple } from "common";

function name_parts(fullName: string): readonly [string, string | undefined] {
  const [first, last] = Str.capitalize_words(
    fullName.trim().toLocaleLowerCase()
  ).split(" ", 2);
  return tuple(first, last);
}

export function shortest_unique_abbreviation(
  fullName: string,
  allNames: string[]
): string {
  const others = allNames.filter((name) => name !== fullName);
  return as_unique(fullName, others, first_letter) ?? abbreviated(fullName);
}

export function shortest_unique_name(
  fullName: string,
  allNames: string[]
): string {
  const others = allNames.filter((name) => name !== fullName);

  return (
    as_unique(fullName, others, first_name) ??
    as_unique(fullName, others, last_name) ??
    as_unique(fullName, others, first_name_with_last_letter) ??
    as_unique(fullName, others, first_letter_with_last_name) ??
    fullName
  );
}

function as_unique(
  fullName: string,
  others: string[],
  shortner: (name: string) => string | undefined
): string | undefined | null {
  const short = shortner(fullName);
  if (short == null) {
    return;
  }

  if (others.every((name) => short !== shortner(name))) {
    return short;
  }

  return null;
}

const first_letter = (fullName: string): string => name_parts(fullName)[0][0];

function abbreviated(fullName: string): string {
  const [first, last] = name_parts(fullName);
  return first[0] + (last != null ? last[0] : "?");
}

const first_name = (fullName: string): string => name_parts(fullName)[0];

const last_name = (fullName: string): string | undefined =>
  name_parts(fullName)[1];

function first_name_with_last_letter(fullName: string): string | undefined {
  const [first, last] = name_parts(fullName);
  return last != null ? first + last[0] : undefined;
}

function first_letter_with_last_name(fullName: string): string | undefined {
  const [first, last] = name_parts(fullName);
  return last != null ? first[0] + last : undefined;
}
