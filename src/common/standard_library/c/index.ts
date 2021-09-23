import { C as introspectC } from "./introspect";
import { C as orderC } from "./order";
import { C as reduceC } from "./reduce";

export const C = {
  ...introspectC,
  ...orderC,
  ...reduceC,
} as const;
