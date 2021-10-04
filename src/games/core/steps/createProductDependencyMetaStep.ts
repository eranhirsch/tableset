import { ProductId } from "model/IGame";
import IGameStep from "../../../model/IGameStep";

export const PRODUCTS_DEPENDENCY_META_STEP_ID = "__product";

const createProductDependencyMetaStep = (
  // TODO: We need to make the coupling with the actual game definition tighter
  // so that we don't use aritrary strings here
  productId: ProductId
): Readonly<IGameStep<readonly ProductId[]>> =>
  Object.freeze({
    id: PRODUCTS_DEPENDENCY_META_STEP_ID,
    label: `<Product[${productId}]>`,

    hasValue: ({ productIds }) => productIds.includes(productId),

    extractInstanceValue: ({ productIds }) => productIds,

    isOptional: false,
  });

export default createProductDependencyMetaStep;
