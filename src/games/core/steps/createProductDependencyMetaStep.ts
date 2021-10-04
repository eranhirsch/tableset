import { ProductId } from "model/IGame";
import IGameStep from "../../../model/IGameStep";

export const PRODUCTS_DEPENDENCY_META_STEP_ID = "__product";

const createProductDependencyMetaStep = <Pid extends ProductId>(
  ...requiredProducts: readonly Pid[]
): Readonly<IGameStep<readonly Pid[]>> =>
  Object.freeze({
    id: PRODUCTS_DEPENDENCY_META_STEP_ID,
    label: `<Product[${requiredProducts.join(",")}]>`,

    hasValue: ({ productIds }) =>
      requiredProducts.length === 0 ||
      requiredProducts.some((productId) => productIds.includes(productId)),

    extractInstanceValue: ({ productIds }) => productIds as readonly Pid[],

    isOptional: false,
  });

export default createProductDependencyMetaStep;
