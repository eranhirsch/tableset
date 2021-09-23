type Container<Tv> = readonly Tv[] | Record<keyof any, Tv>;

function count(container: Container<any>): number {
  if (!Array.isArray(container)) {
    container = Object.entries(container);
  }
  return container.length;
}

const is_empty = (container: Container<any>): boolean => count(container) === 0;

export const C = {
  count,
  is_empty,
} as const;
