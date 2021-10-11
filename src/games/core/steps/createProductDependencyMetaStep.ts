import { ProductId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { buildQuery } from "./Query";

export const PRODUCTS_DEPENDENCY_META_STEP_ID = "__product";

const createProductDependencyMetaStep = <Pid extends ProductId>(
  ...requiredProducts: readonly Pid[]
): Readonly<VariableGameStep<readonly Pid[]>> => ({
  id: PRODUCTS_DEPENDENCY_META_STEP_ID,
  label: `<Product[${requiredProducts.join(",")}]>`,

  // trivial impl, these steps are never part of the template.
  coerceInstanceEntry: () => null,

  hasValue: ({ productIds }) =>
    requiredProducts.length === 0 ||
    requiredProducts.some((productId) => productIds.includes(productId)),

  extractInstanceValue: ({ productIds }) => productIds as readonly Pid[],

  query: (_, { productIds: currentProductIds }) =>
    buildQuery(PRODUCTS_DEPENDENCY_META_STEP_ID, {
      willContain: (pid) => currentProductIds.includes(pid),
      willContainAny: (products) =>
        products.some((pid) => currentProductIds.includes(pid)),
    }),
});

export default createProductDependencyMetaStep;
