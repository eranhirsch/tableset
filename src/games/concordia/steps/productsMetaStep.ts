import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type ConcordiaProductId =
  | "aegyptusCreta"
  | "base"
  | "britanniaGermania"
  | "forumMini"
  | "galliaCorsica"
  | "salsa"
  | "venus"
  | "venusBase"
  | "balearicaCyprus"
  | "balearicaItalia"
  | "solitaria";

export const productsMetaStep = createProductsMetaStep<ConcordiaProductId>();
