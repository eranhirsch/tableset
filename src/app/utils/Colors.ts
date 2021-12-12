import avro from "avsc";

/**
 * Define possible colors for game pieces (usually player pieces). Add any color
 * you need here, and then fix any broken type errors in `themeWithGameColors`
 * to make them available to the UX.
 * Note that you can add multiple variations of the same color, these are just
 * symbols for the colors, the names are defined separately.
 */
const ALL_COLOR_IDS = [
  "black",
  "blue",
  "brown",
  "cyan",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "white",
  "yellow",
] as const;
export type ColorId = typeof ALL_COLOR_IDS[number];

const AVRO_TYPE: avro.schema.DefinedType = {
  type: "enum",
  name: "ColorId",
  symbols: [...ALL_COLOR_IDS],
};

export const Colors = {
  ALL: ALL_COLOR_IDS,
  label: (colorId: ColorId) => colorName[colorId],
  avroType: AVRO_TYPE,
} as const;

/**
 * These names would be used in contexts where we need to describe the color
 * textually. Multiple piece colors can share a name (in case different games
 * want to use different hues for the same "color").
 */
const colorName: Readonly<Required<Record<ColorId, string>>> = {
  black: "Black",
  blue: "Blue",
  brown: "Brown",
  cyan: "Cyan",
  green: "Green",
  orange: "Orange",
  pink: "Pink",
  purple: "Purple",
  red: "Red",
  white: "White",
  yellow: "Yellow",
};
