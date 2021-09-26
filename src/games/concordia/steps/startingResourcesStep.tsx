import { Typography } from "@mui/material";
import { Vec } from "common";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import React from "react";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { Resource } from "../utils/CityResourcesEncoder";
import resourceLabel from "../utils/resourceLabel";
import noStartingResourcesVariant from "./noStartingResourcesVariant";

const STARTING_RESOURCES: Record<Resource, number> = Object.freeze({
  cloth: 1,
  wine: 1,
  tools: 1,
  food: 2,
  bricks: 1,
});

export default createDerivedGameStep({
  id: "startingResources",
  dependencies: [noStartingResourcesVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isNoStartingResourcesVariantEnabled],
}: DerivedStepInstanceComponentProps<true>): JSX.Element {
  if (isNoStartingResourcesVariantEnabled != null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            When playing the "No Starting Resources" variant players don't take
            any resources during setup; they will buy resources at the start of
            the their first turn instead.
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Skip this step
            <Footnote index={1} />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Typography variant="body1">
      Each player takes{" "}
      <GrammaticalList>
        {Vec.filter_nulls(
          Vec.map_with_key(STARTING_RESOURCES, (resource, count) =>
            count > 0 ? (
              <React.Fragment key={`starting_resource_${resource}`}>
                {count} <strong>{resourceLabel(resource as Resource)}</strong>
              </React.Fragment>
            ) : null
          )
        )}
      </GrammaticalList>{" "}
      and places them in their <strong>storehouse</strong>, each in it's own
      cell.
    </Typography>
  );
}
