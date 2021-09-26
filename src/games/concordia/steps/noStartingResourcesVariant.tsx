import { Random } from "common";
import { createVariableGameStep } from "games/core/steps/createVariableGameStep";

export default createVariableGameStep({
  id: "variant_noStartingResources",
  labelOverride: "Variant: No Starting Resources",

  isType: (value): value is true => value === true,

  isOptional: true,

  random: () => (Random.coin_flip(0.5) ? true : null),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return <div>Playing with the "No Starting Resources" variant.</div>;
}
