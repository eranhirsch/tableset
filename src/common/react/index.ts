import { ReactUtils as utilsHooks } from "./hooks";
import { ReactUtils as flatten } from "./flattenChildren";

export const ReactUtils = {
  ...utilsHooks,
  ...flatten,
} as const;
