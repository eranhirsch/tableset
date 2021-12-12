import { ProductId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { buildQuery } from "./Query";

type BaseOnly = "base";

export const createProductsMetaStep = <
  Pid extends ProductId = BaseOnly
>(): Readonly<VariableGameStep<readonly Pid[]>> => ({
  id: "__product",
  label: `<Product>`,

  extractInstanceValue: (_, { productIds }) => productIds as readonly Pid[],

  query: (_, { productIds: currentProductIds }) =>
    buildQuery("__product", {
      willContain: (pid) => currentProductIds.includes(pid),
      willContainAny: (products) =>
        products.some((pid) => currentProductIds.includes(pid)),
      onlyResolvableValue: () => currentProductIds as readonly Pid[],
    }),
});

