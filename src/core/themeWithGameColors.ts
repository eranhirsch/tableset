import { createTheme } from "@material-ui/core";
import { grey, blue, green, red, yellow, pink } from "@material-ui/core/colors";

declare module "@material-ui/core/styles" {
  interface Palette {
    black: Palette["primary"];
    blue: Palette["primary"];
    green: Palette["primary"];
    pink: Palette["primary"];
    red: Palette["primary"];
    white: Palette["primary"];
    yellow: Palette["primary"];
  }

  interface PaletteOptions {
    black: PaletteOptions["primary"];
    blue: PaletteOptions["primary"];
    green: PaletteOptions["primary"];
    pink: PaletteOptions["primary"];
    red: PaletteOptions["primary"];
    white: PaletteOptions["primary"];
    yellow: PaletteOptions["primary"];
  }
}

declare module "@material-ui/core/Badge" {
  interface BadgePropsColorOverrides {
    black: true;
    blue: true;
    green: true;
    pink: true;
    red: true;
    white: true;
    yellow: true;
  }
}

const colorDefs = Object.freeze({
  black: { main: grey[900] },
  blue: { main: blue[500] },
  green: { main: green[500] },
  pink: { main: pink[500] },
  red: { main: red[500] },
  white: { main: grey[50] },
  yellow: { main: yellow[500] },
});

export type GamePiecesColor = keyof typeof colorDefs;

const themeWithGameColors = createTheme({
  palette: colorDefs,
});
export default themeWithGameColors;
