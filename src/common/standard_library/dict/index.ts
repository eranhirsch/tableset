import { Dict as asyncDict } from "./async";
import { Dict as combineDict } from "./combine";
import { Dict as divideDict } from "./divide";
import { Dict as introspectDict } from "./introspect";
import { Dict as orderDict } from "./order";
import { Dict as selectDict } from "./select";
import { Dict as transformDict } from "./transform";

export const Dict = {
  ...asyncDict,
  ...combineDict,
  ...divideDict,
  ...introspectDict,
  ...orderDict,
  ...selectDict,
  ...transformDict,
} as const;
