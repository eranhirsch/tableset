/**
 * Define possible colors for game pieces (usually player pieces). Add any color
 * you need here, and then fix any broken type errors in `themeWithGameColors`
 * to make them available to the UX.
 * Note that you can add multiple variations of the same color, these are just
 * symbols for the colors, the names are defined separately.
 */
export const GAME_PIECES_COLORS = [
  "black",
  "blue",
  "cyan",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "white",
  "yellow",
] as const;
export type GamePiecesColor = typeof GAME_PIECES_COLORS[number];
