/**
 * This file defines everything needed to push extra colors into the theme
 * palette for MUI. It makes the game piece colors available when using the
 * `color` prop (or similar) in the actual components.
 *
 * You only need to add definitions to this file when typescript surfaces type
 * issues after adding a new color in GamePiecesColor, otherwise you don't need
 * to touch anything else here.
 * @see GamePiecesColor
 */
import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material";
import { blue, green, grey, pink, red, yellow } from "@mui/material/colors";
import GamePiecesColor from "model/GamePiecesColor";

/**
 * These names would be used in contexts where we need to describe the color
 * textually. Multiple piece colors can share a name (in case different games
 * want to use different hues for the same "color").
 */
export const colorName: Readonly<Record<GamePiecesColor, string>> =
  Object.freeze({
    black: "Black",
    blue: "Blue",
    green: "Green",
    red: "Red",
    yellow: "Yellow",
    white: "White",
    pink: "Pink",
  });

/**
 * For each color we want to add we need to provide all colors required by the
 * palette. This includes the main color, a light and dark variations, and most
 * importantly the color of text on this color (`contrastText`).
 *
 * We use the Material design v1 color schemas for the main color, and then the
 * color tool to fill in the rest. This is because they are broad enough to
 * cover most of our needs. If you need even more flexibility you can use
 * regular RGB values directly.
 *
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

declare module "@mui/material/styles" {
  // We need to add the color ids into the main palette object so they can be
  // used wherever a prop expects a theme color.

  interface Palette extends Record<GamePiecesColor, PaletteColor> {}
  interface PaletteOptions
    extends Record<GamePiecesColor, PaletteColorOptions> {}
}

// Certain UI elements don't accept palette colors directly, and require us to
// manually add the colors as overrides.
type ColorOverrides = Record<GamePiecesColor, true>;
declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides extends ColorOverrides {}
}
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides extends ColorOverrides {}
}

export default createTheme({
  palette: colorDefs,
});
