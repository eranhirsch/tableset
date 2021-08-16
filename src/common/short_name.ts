export default function short_name(fullName: string): string {
  const [first, last] = fullName.split(" ");
  return `${first[0]}${last[0]}`;
}
