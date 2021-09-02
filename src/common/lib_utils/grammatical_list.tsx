export default function grammatical_list(terms: readonly string[]): string {
  if (terms.length === 1) {
    return terms[0];
  }

  if (terms.length === 2) {
    return terms.join(" and ");
  }

  return `${terms.slice(0, terms.length - 1).join(", ")}, and ${
    terms[terms.length - 1]
  }`;
}
