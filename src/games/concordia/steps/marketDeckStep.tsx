import React from "react";
import array_range from "../../../common/lib_utils/array_range";
import { PlayerId } from "../../../core/model/Player";
import { InstanceStepLink } from "../../../features/instance/InstanceStepLink";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import { ROMAN_NUMERALS } from "../utils/ROMAN_NUMERALS";
import marketCardsStep from "./marketCardsStep";
import marketDisplayStep from "./marketDisplayStep";

export default createDerivedGameStep({
  id: "marketDeck",

  dependencies: [createPlayersDependencyMetaStep({ max: 5 })],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  let stackingStep = null;
  if (playerIds == null) {
    stackingStep = (
      <BlockWithFootnotes
        footnotes={[
          <>
            e.g. In a 4 player game put deck IV on the bottom, then deck III,
            and finally deck II
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Stack the decks face down one on top of the other, putting the
            higher value numerals at the bottom
            <Footnote index={1} />.
          </>
        )}
      </BlockWithFootnotes>
    );
  } else if (playerIds.length > 2) {
    stackingStep = (
      <>
        Stack the decks facedown one on top of each other starting from deck{" "}
        <strong>{ROMAN_NUMERALS[playerIds.length]}</strong> then{" "}
        <GrammaticalList>
          {array_range(playerIds.length - 1, 1).map((deck) => (
            <React.Fragment key={`stack_deck_${deck}`}>
              deck <strong>{ROMAN_NUMERALS[deck]}</strong>
            </React.Fragment>
          ))}
        </GrammaticalList>
        .
      </>
    );
  }

  return (
    <HeaderAndSteps synopsis="Form the personality cards deck:">
      <BlockWithFootnotes
        footnotes={[
          <>
            Set aside previously in <InstanceStepLink step={marketCardsStep} />
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Shuffle{" "}
            {playerIds == null ? (
              "each of the remaining personality cards decks"
            ) : (
              <>
                personality cards{" "}
                <GrammaticalList pluralize="deck">
                  {array_range(2, playerIds.length + 1).map((deck) => (
                    <React.Fragment key={`deck_${deck}`}>
                      <strong>{ROMAN_NUMERALS[deck]}</strong>
                    </React.Fragment>
                  ))}
                </GrammaticalList>
              </>
            )}
            <Footnote index={1} />
            {playerIds == null || playerIds.length > 2 ? " seperatly" : ""}.
          </>
        )}
      </BlockWithFootnotes>
      {stackingStep}
      <BlockWithFootnotes
        footnotes={[
          <>
            As mentioned in <InstanceStepLink step={marketDisplayStep} />
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Put the remaining card of deck <strong>I</strong>
            <Footnote index={1} /> facedown on top of the market deck.
          </>
        )}
      </BlockWithFootnotes>
      <>Place the market deck close to the market display.</>
    </HeaderAndSteps>
  );
}
