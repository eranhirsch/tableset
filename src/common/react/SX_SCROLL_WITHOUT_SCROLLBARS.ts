import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material/node_modules/@mui/system";

/**
 * Spread this into an SX prop in a component to enable scrolling it but hiding
 * the scrollbars like it is in most material design apps in the Google Suite.
 *
 * Copied from an answer in stack overflow I didn't copy the URL of. Sorry for
 * not giving the proper credit :-/
 */
const SX_SCROLL_WITHOUT_SCROLLBARS: SxProps<Theme> = {
  overflow: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
};
export default SX_SCROLL_WITHOUT_SCROLLBARS;
