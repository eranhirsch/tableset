import { ReactUtils as flatten } from "./flattenChildren";
import { ReduxToolkit } from "./redux-toolkit";
import { Router } from "./router";
import { default as SX_SCROLL_WITHOUT_SCROLLBARS } from "./SX_SCROLL_WITHOUT_SCROLLBARS";

export const ReactUtils = {
  ...flatten,
  ...ReduxToolkit,
  ...Router,
  SX_SCROLL_WITHOUT_SCROLLBARS,
} as const;
