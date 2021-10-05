import { ProductId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";

export const PRODUCTS_DEPENDENCY_META_STEP_ID = "__product";

const createProductDependencyMetaStep = <Pid extends ProductId>(
  ...requiredProducts: readonly Pid[]
): Readonly<VariableGameStep<readonly Pid[]>> =>
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
