import { createVariant } from "games/core/steps/createVariant";

export default createVariant({
  id: "salsa",
  name: "Salsa",
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return <div>Hello World!</div>;
}
