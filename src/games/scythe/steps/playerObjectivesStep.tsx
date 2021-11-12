import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";

export default createGameStep({
  id: "playerObjectives",
  labelOverride: "Objectives",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <>
          Players should keep the cards <em>secret</em>.
        </>
      }
    >
      {(Footnote) => (
        <>
          Deal each player a hand of <strong>2</strong> objective cards
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
