import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type WingspanProductId = "base" | "swiftStart" | "europe" | "oceania";

export default createProductsMetaStep<WingspanProductId>();
