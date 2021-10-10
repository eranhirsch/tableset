import { ProductId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";

export const PRODUCTS_DEPENDENCY_META_STEP_ID = "__product";

const createProductDependencyMetaStep = <Pid extends ProductId>(): Readonly<
  VariableGameStep<readonly Pid[]>
> => ({
  id: PRODUCTS_DEPENDENCY_META_STEP_ID,
  label: `<Products>`,

  // trivial impl, these steps are never part of the template.
  coerceInstanceEntry: () => null,

  hasValue: () => true,

  extractInstanceValue: ({ productIds }) => productIds as readonly Pid[],
});

export default createProductDependencyMetaStep;
