import { C as orderC } from "./order";
import { C as selectC } from "./select";

export const C = {
  ...orderC,
  ...selectC,
} as const;
