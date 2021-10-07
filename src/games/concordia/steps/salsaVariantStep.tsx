import createProductDependencyMetaStep from "games/core/steps/createProductDependencyMetaStep";
import { createVariant } from "games/core/steps/createVariant";
import { ConcordiaProductId } from "../concordiaGame";

export default createVariant({
  id: "salsa",
  name: "Salsa",
  dependencies: [createProductDependencyMetaStep<ConcordiaProductId>("salsa")],
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return <div>Hello World!</div>;
}
