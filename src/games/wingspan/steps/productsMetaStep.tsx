import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type WingspanProductId = "base" | "europe" | "oceania";

export default createProductsMetaStep<WingspanProductId>();
