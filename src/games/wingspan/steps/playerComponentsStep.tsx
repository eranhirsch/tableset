import { Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import React from "react";
import { Food } from "../utils/Food";
import swiftStartVariant from "./swiftStartVariant";

export const BIRD_CARDS_PER_PLAYER = 5;

export default createDerivedGameStep({
  id: "playerComponents",
  dependencies: [playersMetaStep, swiftStartVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isSwiftStart],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <HeaderAndSteps synopsis={`${isSolo ? "Take" : "Each player receives"}:`}>
      <>
        <strong>1</strong> player mat.
      </>
      <>
        <strong>8</strong> action cubes of {isSolo ? "your" : "their"} color.
      </>
      {!isSwiftStart && (
        <>
          <strong>{BIRD_CARDS_PER_PLAYER}</strong> random bird cards
          {
            // TODO: We can consider this a variant, but it probably would be
            // overkill to also make this a random step and randomize the birds
            // for each player (it would require us to have a list of all 170
            // birds, and for the players to scan the deck to find them)
            !isSolo && (
              <>
                ;{" "}
                <em>
                  You may keep your hand of cards private or public throughout
                  the game.
                </em>
              </>
            )
          }
          .
        </>
      )}
      {!isSwiftStart && (
        <BlockWithFootnotes
          footnote={
            <>
              The types are:{" "}
              <GrammaticalList>
                {React.Children.toArray(
                  Vec.map(Food.ALL_IDS, (food) => <>{Food.LABELS[food]}</>)
                )}
              </GrammaticalList>
            </>
          }
        >
          {(Footnote) => (
            <>
              <strong>5</strong> food tokens
              <em>
                ; <strong>1</strong> of each type
                <Footnote />.
              </em>
            </>
          )}
        </BlockWithFootnotes>
      )}
    </HeaderAndSteps>
  );
}
