import combinations from "./combinations";
import { MathUtils as combUtils } from "./combinationsLazyArray";
import { MathUtils as containerUtils } from "./containers";
import factorial from "./factorial";
import { MathUtils as permUtils } from "./permutationsLazyArray";

export const MathUtils = {
  ...containerUtils,
  ...permUtils,
  ...combUtils,
  factorial,
  combinations,
} as const;
