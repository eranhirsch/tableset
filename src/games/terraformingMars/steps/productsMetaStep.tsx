import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type TerraformingMarsProductId =
  | "base"
  | "venus"
  | "prelude"
  | "boards"
  | "colonies"
  | "turmoil";

export default createProductsMetaStep<TerraformingMarsProductId>();
