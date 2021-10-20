import { Num as base32Num } from "./base32";
import { Num as base64Num } from "./base64";
import { Num as castNum } from "./cast";
import { Num as hashNum } from "./hash";
import { Num as rangeNum } from "./range";

export const Num = {
  ...base32Num,
  ...base64Num,
  ...castNum,
  ...rangeNum,
  ...hashNum,
} as const;
