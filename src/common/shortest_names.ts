const name_parts = (fullName: string): string[] => fullName.trim().split(" ");

const capitalize = (word: string): string =>
  `${word[0].toLocaleUpperCase()}${word.slice(1).toLocaleLowerCase()}`;

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

function first_letter(fullName: string): string {
  const [first] = name_parts(fullName);
  return first[0];
}

function abbreviated(fullName: string): string {
  const [first, last] = name_parts(fullName);
  return (
    last != null ? `${first[0]}${last[0]}` : first[0]
  ).toLocaleUpperCase();
}

function first_name(fullName: string): string {
  const [first] = name_parts(fullName);
  return capitalize(first);
}

function last_name(fullName: string): string | undefined {
  const [, last] = name_parts(fullName);
  return last != null ? capitalize(last) : undefined;
}

function first_name_with_last_letter(fullName: string): string | undefined {
  const [first, last] = name_parts(fullName);
  return last != null
    ? `${capitalize(first)} ${last[0].toLocaleUpperCase()}`
    : undefined;
}

function first_letter_with_last_name(fullName: string): string | undefined {
  const [first, last] = name_parts(fullName);
  return last != null
    ? `${first[0].toLocaleUpperCase()} ${capitalize(last)}`
    : undefined;
}
