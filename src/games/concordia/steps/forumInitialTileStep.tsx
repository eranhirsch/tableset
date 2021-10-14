import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import forumDecksStep from "./forumDecksStep";
import forumVariantStep from "./forumVariantStep";

export default createDerivedGameStep({
  id: "forumInitial",
  labelOverride: "Forum Starting Tile",
  dependencies: [forumVariantStep],
  skip: ([forum]) => forum == null,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Each player picks a starting forum Patrician tile:">
      <BlockWithFootnotes
        footnotes={[<InstanceStepLink step={forumDecksStep} />]}
      >
        {(Footnote) => (
          <>
            Shuffle the Patricians deck
            <Footnote index={1} />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Players get <strong>2</strong> Patrician tiles each.
      </>
      <>
        Each player picks <strong>1</strong> Patrician tile that they would
        keep, <em>and returns the other to the deck</em>.{" "}
      </>
    </HeaderAndSteps>
  );
}
