import { ProductId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { buildQuery } from "./Query";

export const createProductsMetaStep = <Pid extends ProductId>(): Readonly<
  VariableGameStep<readonly Pid[]>
> => ({
  id: "__product",
  label: `<Product>`,

  // trivial impl, these steps are never part of the template.
  coerceInstanceEntry: () => null,

  hasValue: ({ productIds }) => true,

  extractInstanceValue: ({ productIds }) => productIds as readonly Pid[],

  query: (_, { productIds: currentProductIds }) =>
    buildQuery("__product", {
      willContain: (pid) => currentProductIds.includes(pid),
      willContainAny: (products) =>
        products.some((pid) => currentProductIds.includes(pid)),
      resolve: () => currentProductIds as readonly Pid[],
    }),
});

