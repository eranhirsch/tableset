import { Vec } from "common";
import { ProductId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";

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

  query: (_, { productIds }) => ({
    canResolveTo: (requestedProductIds: readonly Pid[]) =>
      Vec.contained_in(requestedProductIds, productIds),
    willResolve: () => true,
  }),
});

export default createProductDependencyMetaStep;
