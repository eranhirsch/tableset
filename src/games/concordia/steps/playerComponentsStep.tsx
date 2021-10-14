import { createGameStep } from "games/core/steps/createGameStep";
import React from "react";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import RomanTitle from "../ux/RomanTitle";

const PLAYER_CARDS = [
  "Architect",
  "Diplomat",
  "Mercator",
  "Prefect",
  "Prefect",
  "Senator",
  "Tribune",
] as const;

export default createGameStep({
  id: "playerComponents",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Each player takes all player components in their color:">
      <>
        A <strong>storehouse</strong> board, placing it in front of them.
      </>
      <>
        6 wooden <strong>colonist</strong> meeples: 3 <strong>land</strong>{" "}
        colonists, and 3 <strong>sea</strong> colonists, placing them in the
        storehouse, each in it's own cell.
      </>
      <>
        15 wooden <strong>houses</strong>, placing them near (but not{" "}
        <em>IN</em>) the storehouse.
      </>
      <>
        A wooden <strong>scoring marker</strong> disc, placing it on the board's
        score track, on the 0 score space.
      </>
      <>
        A <strong>player aid</strong> card.
      </>
      <BlockWithFootnotes
        footnotes={[
          <>
            Cards:{" "}
            <GrammaticalList>
              {PLAYER_CARDS.map((card) => (
                <React.Fragment key={card}>
                  <RomanTitle>{card}</RomanTitle>
                </React.Fragment>
              ))}
            </GrammaticalList>
            .
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            {PLAYER_CARDS.length} <strong>personality cards</strong>
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}
