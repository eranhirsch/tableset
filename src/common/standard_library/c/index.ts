import { C as orderC } from "./order";
import { C as reduceC } from "./reduce";
import { C as selectC } from "./select";

export const C = {
  ...orderC,
  ...reduceC,
  ...selectC,
} as const;
