import { Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import GrammaticalList from "games/core/ux/GrammaticalList";
import { createVariant } from "../../core/steps/createVariant";
import { resourceName, RESOURCE_COST } from "../utils/resource";
import { STEP_ID as startingMoneyStepId } from "./startingMoneyStep";
import { STEP_ID as startingResourcesStepId } from "./startingResourcesStep";

export default createVariant({
  id: "noStartingResources",
  name: "No Starting Resources",
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <InstanceStepLink step={startingResourcesStepId} />,
        <InstanceStepLink step={startingMoneyStepId} />,
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
