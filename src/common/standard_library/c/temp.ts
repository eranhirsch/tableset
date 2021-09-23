function count(container: readonly any[] | Record<keyof any, any>): number {
  if (!Array.isArray(container)) {
    container = Object.entries(container);
  }
  return container.length;
}

export const C = {
  count,
} as const;
