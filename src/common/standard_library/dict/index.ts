import { Dict as asyncDict } from "./async";
import { Dict as selectDict } from "./select";
import { Dict as transformDict } from "./transform";
import { Dict as xDict } from "./x";

export const Dict = {
  ...asyncDict,
  ...selectDict,
  ...transformDict,
  ...xDict,
} as const;
