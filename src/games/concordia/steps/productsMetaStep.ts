import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type ConcordiaProductId =
  | "aegyptusCreta"
  | "base"
  | "britanniaGermania"
  | "forumMini"
  | "galliaCorsica"
  | "salsa";

export const productsMetaStep = createProductsMetaStep<ConcordiaProductId>();
