import { Vec } from "common";
import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import React from "react";

const RESOURCE_DESCRIPTION = {
  Food: "yellow sacks",
  Wood: "brown logs",
  Oil: "indigo barrels",
  Metal: "gray ingots",
} as const;

export default createGameStep({
  id: "resources",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <>
          The 4 resources are{" "}
          <GrammaticalList>
            {Vec.map_with_key(RESOURCE_DESCRIPTION, (resource, desc) => (
              <React.Fragment key={resource}>
                <strong>{resource}</strong> ({desc})
              </React.Fragment>
            ))}
          </GrammaticalList>
        </>
      }
    >
      {(Footnote) => (
        <>
          Create a pile for each resource
          <Footnote /> at the side of the board, also putting the <em>
            +3
          </em>{" "}
          and <em>+7</em> chits for each resource nearby.
        </>
      )}
    </BlockWithFootnotes>
  );
}
