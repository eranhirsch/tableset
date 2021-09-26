import { Random, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { createVariableGameStep } from "games/core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import GrammaticalList from "games/core/ux/GrammaticalList";
import { RESOURCE_COST, resourceName } from "../utils/resource";
import startingMoneyStep from "./startingMoneyStep";
import startingResourcesStep from "./startingResourcesStep";

export default createVariableGameStep({
  id: "variant_noStartingResources",
  labelOverride: "Variant: No Starting Resources",

  isType: (value): value is true => value === true,

  isOptional: true,

  random: () => (Random.coin_flip(0.5) ? true : null),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <InstanceStepLink step={startingResourcesStep} />,
        <InstanceStepLink step={startingMoneyStep} />,
        <>
          At their regular prices:{" "}
          <GrammaticalList>
            {Vec.map_with_key(
              RESOURCE_COST,
              (resource, cost) => `${resourceName(resource)}-${cost}`
            )}
          </GrammaticalList>
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Players will take <em>no</em> starting resources
          <Footnote index={1} />; <strong>instead</strong>, they will get{" "}
          <em>more</em> money to start
          <Footnote index={2} />, and <em>before their first turn</em> they will
          buy the resources they need
          <Footnote index={3} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
