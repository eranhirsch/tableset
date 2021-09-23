import { Vec as asyncVec } from "./async";
import { Vec as combineVec } from "./combine";
import { Vec as divideVec } from "./divide";
import { Vec as orderVec } from "./order";
import { Vec as selectVec } from "./select";
import { Vec as transformVec } from "./transform";
export * from "./vec";

export const Vec = {
  ...asyncVec,
  ...combineVec,
  ...divideVec,
  ...orderVec,
  ...selectVec,
  ...transformVec,
} as const;
