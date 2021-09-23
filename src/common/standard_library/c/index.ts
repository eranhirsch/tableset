import { C as introspectC } from "./introspect";
import { C as orderC } from "./order";
import { C as reduceC } from "./reduce";
import { C as selectC } from "./select";

export const C = {
  ...introspectC,
  ...orderC,
  ...reduceC,
  ...selectC,
} as const;
