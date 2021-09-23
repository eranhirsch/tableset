import { Typography } from "@mui/material";
import { Vec } from "common";
import React from "react";
import createGameStep from "../../core/steps/createGameStep";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { Resource } from "../utils/CityResourcesEncoder";
import resourceLabel from "../utils/resourceLabel";

const STARTING_RESOURCES: Record<Resource, number> = Object.freeze({
  cloth: 1,
  wine: 1,
  tools: 1,
  food: 2,
  bricks: 1,
});

export default createGameStep({
  id: "startingResources",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
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
