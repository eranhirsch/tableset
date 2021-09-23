import { Dict as asyncDict } from "./async";
import { Dict as combineDict } from "./combine";
import { Dict as divideDict } from "./divide";
import { Dict as introspectDict } from "./introspect";
import { Dict as selectDict } from "./select";
import { Dict as transformDict } from "./transform";
import { Dict as xDict } from "./x";

export const Dict = {
  ...asyncDict,
  ...combineDict,
  ...divideDict,
  ...introspectDict,
  ...selectDict,
  ...transformDict,
  ...xDict,
} as const;
