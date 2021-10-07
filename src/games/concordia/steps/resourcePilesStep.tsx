import { Shape, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import GrammaticalList from "games/core/ux/GrammaticalList";
import { RESOURCE_NAME } from "../utils/resource";
import salsaVariantStep from "./salsaVariantStep";

export default createDerivedGameStep({
  id: "resourcePiles",
  dependencies: [salsaVariantStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [withSalsa],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          <GrammaticalList>
            {Vec.map_with_key(
              Shape.diff_by_key(
                RESOURCE_NAME,
                withSalsa ? {} : { salt: undefined }
              ),
              (_, name) => name
            )}
          </GrammaticalList>
          .
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Separate the resources
          <Footnote index={1} /> into piles near the board.
        </>
      )}
    </BlockWithFootnotes>
  );
}
