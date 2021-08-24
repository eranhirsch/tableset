export default function short_name(fullName: string): string {
  const [first, last] = fullName.split(" ");
  return last != null ? `${first[0]}${last[0]}` : first[0];
}
