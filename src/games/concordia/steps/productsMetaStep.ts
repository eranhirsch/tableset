import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type ConcordiaProductId =
  | "base"
  | "britanniaGermania"
  | "salsa"
  | "galliaCorsica";

export const productsMetaStep = createProductsMetaStep<ConcordiaProductId>();
