import { MathUtils as containerUtils } from "./containers";
import factorial from "./factorial";
import { MathUtils as permUtils } from "./permutationsLazyArray";

export const MathUtils = {
  ...containerUtils,
  ...permUtils,
  factorial,
} as const;
