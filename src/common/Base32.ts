export default class Base32 {
  public static encode(x: number): string {
    return x
      .toString(32)
      .toUpperCase()
      .replace("0", "W")
      .replace("1", "X")
      .replace("O", "Y")
      .replace("I", "Z");
  }

  public static decode(x: string): number {
    return Number.parseInt(x, 32);
  }
}
