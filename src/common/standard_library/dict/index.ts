import { Dict as asyncDict } from "./async";
import { Dict as transformDict } from "./transform";
import { Dict as xDict } from "./x";

export const Dict = {
  ...asyncDict,
  ...transformDict,
  ...xDict,
} as const;
