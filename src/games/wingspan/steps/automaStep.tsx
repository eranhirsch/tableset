import { Vec } from "common";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import React from "react";
import BirdName from "../ux/BirdName";

const AUTOMA_LEVELS: Readonly<Record<string, number>> = {
  Eaglet: 3,
  Eagle: 4,
  "Eagle-eyed Eagle": 5,
};

export default createDerivedGameStep({
  id: "automa",
  dependencies: [playersMetaStep],
  skip: ([playerIds]) => playerIds!.length > 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Setup the components needed for running the Automa:">
      <>
        Give the Automa <strong>8</strong>{" "}
        <ChosenElement extraInfo="cubes">action</ChosenElement> cubes of one
        color.
      </>
      <BlockWithFootnotes
        footnote={
          <>
            You can adjust the Automa’s difficulty to suit your play style by
            changing the points the Automa receives for each face-down bird
            card:
            <br />
            <GrammaticalList>
              {React.Children.toArray(
                Vec.map_with_key(AUTOMA_LEVELS, (levelName, points) => (
                  <>
                    <em>{levelName}</em>: <strong>{points}</strong> points
                  </>
                ))
              )}
            </GrammaticalList>
          </>
        }
      >
        {(Footnote) => (
          <>
            Choose your{" "}
            <ChosenElement extraInfo="level">difficulty</ChosenElement>
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Decide if to remove the expert-level{" "}
        <ChosenElement extraInfo="card">Automubon Society</ChosenElement> from
        the Automa deck, <em>and if so return it to the box</em>.
      </>
      <>
        Shuffle the <ChosenElement extraInfo="cards">Automa</ChosenElement>.
      </>
      <>
        Place the <ChosenElement extraInfo="deck">Automa</ChosenElement>{" "}
        face-down within reach.
      </>
      <>
        Place the{" "}
        <ChosenElement extraInfo="card">Current Round Tracker</ChosenElement> to
        the left of it, oriented so that <em>Round 1</em> is readable, and it's
        arrow is facing to <em>the right</em>.
      </>
      <>
        Draw and reveal a <ChosenElement extraInfo="card">Bonus</ChosenElement>{" "}
        for the Automa. If the bonus card is{" "}
        <BirdName>Breeding Manager</BirdName> or{" "}
        <BirdName>Backyard Birder</BirdName>, or if it does not show{" "}
        <strong>(X% of cards)</strong> at the bottom of the card, return it to
        the deck and select another. Repeat if necessary and then reshuffle the
        bonus deck before continuing with setup.
      </>
      <>
        Place the{" "}
        <ChosenElement extraInfo="card">
          End-of-round Goal Scoring
        </ChosenElement>
        , with <em>Round 1</em> facing up, beside the Round 1 goal tile of the
        goal board.
      </>
    </HeaderAndSteps>
  );
}
