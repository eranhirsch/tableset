export const vec = <Tv>(dict: Readonly<Record<keyof any, Tv>>): readonly Tv[] =>
  Object.values(dict);
