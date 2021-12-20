import { ProductId } from "features/instance/Game";
import { MetaGameStep } from "features/instance/MetaGameStep";
import { buildQuery } from "./Query";
import { Queryable } from "./Queryable";

type BaseOnly = "base";

export type ProductsMetaStep<Pid extends ProductId> = MetaGameStep<
  readonly Pid[]
> &
  Queryable<readonly Pid[]>;

export const createProductsMetaStep = <
  Pid extends ProductId = BaseOnly
>(): Readonly<ProductsMetaStep<Pid>> => ({
  id: "__product",

  computeInstanceValue: (_, { productIds }) => productIds as readonly Pid[],

  query: (_, { productIds: currentProductIds }) =>
    buildQuery("__product", {
      willContain: (pid) => currentProductIds.includes(pid),
      willContainAny: (products) =>
        products.some((pid) => currentProductIds.includes(pid)),
      onlyResolvableValue: () => currentProductIds as readonly Pid[],
    }),
});
