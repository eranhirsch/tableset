import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type AzulProductId = "base" | "crystal" | "joker" | "factories";

export default createProductsMetaStep<AzulProductId>();
