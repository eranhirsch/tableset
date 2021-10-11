import { Dict, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { createVariant } from "../../core/steps/createVariant";
import { RESOURCE_COST, RESOURCE_NAME } from "../utils/resource";

const noStartingResourcesVariant = createVariant({
  id: "noStartingResources",
  name: "No Starting Resources",
  dependencies: [],
  InstanceVariableComponent,
  isTemplatable: () => true,
});
export default noStartingResourcesVariant;

function InstanceVariableComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        // TODO: Find a way to couple these IDs with the steps themselves so
        // that we don't use magic strings here...
        <InstanceStepLink stepId="startingMoney" />,
        <>
          At their regular prices:{" "}
          <GrammaticalList>
            {Vec.map_with_key(
              Dict.filter(RESOURCE_COST, (cost) => cost > 0),
              (resource, cost) => `${RESOURCE_NAME[resource]}-${cost}`
            )}
          </GrammaticalList>
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Players will take <em>no</em> starting resources;{" "}
          <strong>instead</strong>, they will get <em>more</em> money to start
          <Footnote index={2} />, and <em>at the start of their first turn</em>{" "}
          they will <strong>buy</strong> resources
          <Footnote index={3} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
