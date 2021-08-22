export default function array_expand<T extends keyof any>(
  resources: Record<T, number>
): T[] {
  return Object.entries(resources)
    .map(([resource, count]) => Array(count).fill(resource) as T[])
    .flat();
}
