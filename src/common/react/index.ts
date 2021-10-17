import { ReactUtils as flatten } from "./flattenChildren";
import { ReactUtils as utilsHooks } from "./hooks";
import { default as SX_SCROLL_WITHOUT_SCROLLBARS } from "./SX_SCROLL_WITHOUT_SCROLLBARS";

export const ReactUtils = {
  ...utilsHooks,
  ...flatten,
  SX_SCROLL_WITHOUT_SCROLLBARS,
} as const;
