import { Typography } from "@mui/material";
import { Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React from "react";
import { Food } from "../utils/Food";
import swiftStartVariant from "./swiftStartVariant";

export const BIRD_CARDS_PER_PLAYER = 5;

export default createDerivedGameStep({
  id: "playerComponents",
  dependencies: [swiftStartVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isSwiftStart],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <>
      <HeaderAndSteps synopsis="Each player receives:">
        <>
          <strong>1</strong> player mat.
        </>
        <>
          <strong>8</strong> action cubes of their color.
        </>
        <>
          <strong>2</strong> random bonus cards.
        </>
        {!isSwiftStart && (
          <>
            <strong>{BIRD_CARDS_PER_PLAYER}</strong> random bird cards.
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
      <Typography variant="body2" marginTop={2}>
        {/* TODO: Should this be a 2 formal variants? 1 for the bird cards and 1
        for the goals. We can randomize and show the cards in that case. */}
        <em>
          You may keep your hand of cards private or public throughout the game.
        </em>
      </Typography>
    </>
  );
}
