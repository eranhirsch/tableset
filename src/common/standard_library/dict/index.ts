import { Dict as asyncDict } from "./async";
import { Dict as transformDict } from "./transform";

export const Dict = {
  ...asyncDict,
  ...transformDict,
} as const;
