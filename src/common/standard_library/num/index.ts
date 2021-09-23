import { Num as castNum } from "./cast";
import { Num as rangeNum } from "./range";

export const Num = {
  ...castNum,
  ...rangeNum,
} as const;
