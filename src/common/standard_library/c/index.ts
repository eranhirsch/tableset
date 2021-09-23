import { C as introspectC } from "./introspect";
import { C as orderC } from "./order";

export const C = {
  ...introspectC,
  ...orderC,
} as const;
