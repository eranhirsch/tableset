import {
  createTheme,
  PaletteColor,
  PaletteColorOptions,
} from "@material-ui/core";
import { grey, blue, green, red, yellow, pink } from "@material-ui/core/colors";

export type GamePiecesColor =
  | "black"
  | "blue"
  | "green"
  | "pink"
  | "red"
  | "white"
  | "yellow";

export function colorName(color: GamePiecesColor): string {
  switch (color) {
    case "black":
      return "Black";
    case "blue":
      return "Blue";
    case "green":
      return "Green";
    case "pink":
      return "Pink";
    case "red":
      return "Red";
    case "white":
      return "White";
    case "yellow":
      return "Yellow";
  }
}

/**
 * @see https://material.io/resources/color/
 */
const colorDefs: Record<GamePiecesColor, PaletteColor> = Object.freeze({
  black: {
    main: grey[900],
    light: "#484848",
    dark: "#000000",
    contrastText: "#ffffff",
  },
  blue: {
    main: blue[500],
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#000000",
  },
  green: {
    main: green[500],
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#000000",
  },
  pink: {
    main: pink[500],
    light: "#ff6090",
    dark: "#b0003a",
    contrastText: "#000000",
  },
  red: {
    main: red[500],
    light: "#ff7961",
    dark: "#ba000d",
    contrastText: "#000000",
  },
  white: {
    main: grey[50],
    light: "#ffffff",
    dark: "#c7c7c7",
    contrastText: "#000000",
  },
  yellow: {
    main: yellow[500],
    light: "#ffff72",
    dark: "#c8b900",
    contrastText: "#000000",
  },
});

type PaletteExtras = Record<GamePiecesColor, PaletteColor>;
type PaletteOptionsExtras = Record<GamePiecesColor, PaletteColorOptions>;
type ColorOverrides = Record<GamePiecesColor, true>;

declare module "@material-ui/core/styles" {
  interface Palette extends PaletteExtras {}
  interface PaletteOptions extends PaletteOptionsExtras {}
}

declare module "@material-ui/core/Badge" {
  interface BadgePropsColorOverrides extends ColorOverrides {}
}

declare module "@material-ui/core/Chip" {
  interface ChipPropsColorOverrides extends ColorOverrides {}
}

const themeWithGameColors = createTheme({
  palette: colorDefs,
});
export default themeWithGameColors;
