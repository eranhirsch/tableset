import { Typography } from "@mui/material";
import { Shape, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import React from "react";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { Resource, RESOURCE_NAME } from "../utils/resource";
import noStartingResourcesVariant from "./noStartingResourcesVariant";

const STARTING_RESOURCES = Object.freeze({
  cloth: 1,
  wine: 1,
  tools: 1,
  food: 2,
  bricks: 1,
} as Record<Resource, number>);

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
            Due to playing with{" "}
            <InstanceStepLink step={noStartingResourcesVariant} />.
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Nothing to do
            <Footnote index={1} />! Skip this step.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Typography variant="body1">
      Each player takes{" "}
      <GrammaticalList>
        {Vec.map_with_key(
          Shape.filter(STARTING_RESOURCES, (count) => count > 0),
          (resource, count) => (
            <React.Fragment key={`starting_resource_${resource}`}>
              {count} <strong>{RESOURCE_NAME[resource]}</strong>
            </React.Fragment>
          )
        )}
      </GrammaticalList>{" "}
      and places them in their <strong>storehouse</strong>, each in it's own
      cell.
    </Typography>
  );
}
