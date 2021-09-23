import { MathUtils as permUtils } from "./permutationsLazyArray";
import { MathUtils as containerUtils } from "./containers";

export const MathUtils = {
  ...containerUtils,
  ...permUtils,
} as const;
