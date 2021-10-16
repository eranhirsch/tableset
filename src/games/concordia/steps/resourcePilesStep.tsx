import { Shape, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { RESOURCE_NAME } from "../utils/resource";
import saltVariantStep from "./saltVariantStep";

export default createDerivedGameStep({
  id: "resourcePiles",
  dependencies: [saltVariantStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [withSalt],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <>
          <GrammaticalList>
            {Vec.map_with_key(
              Shape.diff_by_key(
                RESOURCE_NAME,
                withSalt ? {} : { salt: undefined }
              ),
              (_, name) => name
            )}
          </GrammaticalList>
          .
        </>
      }
    >
      {(Footnote) => (
        <>
          Separate the resources
          <Footnote /> into piles near the board.
        </>
      )}
    </BlockWithFootnotes>
  );
}
