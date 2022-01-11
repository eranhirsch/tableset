import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";

export default createGameStep({
  id: "keepCards",
  InstanceManualComponent: () => (
    <BlockWithFootnotes
      footnotes={[
        <>
          You will probably want to keep food tokens shown in the upper left of
          the bird cards you selected.
        </>,
        <>
          For example, you might keep 2 bird cards and 3 food, or you might keep
          4 bird cards and 1 food.
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Keep up to <strong>5</strong> bird cards and discard the others
          <Footnote index={1} />.{" "}
          <strong>
            For each bird card you keep, you must discard 1 food token.
          </strong>
          <Footnote index={2} />.
        </>
      )}
    </BlockWithFootnotes>
  ),
});
