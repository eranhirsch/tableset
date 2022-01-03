import { Stack, Typography } from "@mui/material";
import { $, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import React from "react";
import advancedVariant from "./advancedVariant";

const SIMPLE_MODE_CARDS = [
  "English Support",
  "Scottish Support",
  "Welsh Support",
] as const;

const BASE_CARDS = [
  /* Spell-checker: disable */
  "Assemble",
  "Assemble",
  "Negotiate",
  "Manoeuvre",
  "Outmanoeuvre",
  /* Spell-checker: enable */
] as const;

const NUM_ADVANCED_CARDS = 12;
const ADVANCED_CARDS_PER_PLAYER = 3;

export default createDerivedGameStep({
  id: "cards",
  dependencies: [playersMetaStep, advancedVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isAdvanced],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  if (!isAdvanced) {
    return (
      <>
        <Typography variant="body1">
          Deal each player the following{" "}
          <strong>{BASE_CARDS.length + SIMPLE_MODE_CARDS.length}</strong> action
          cards:
        </Typography>
        <Stack marginTop={2} marginX={4} spacing={1}>
          {$(
            SIMPLE_MODE_CARDS,
            ($$) => Vec.concat($$, BASE_CARDS),
            ($$) => Vec.map($$, (card) => <strong>{card}</strong>),
            React.Children.toArray
          )}
        </Stack>
      </>
    );
  }

  return (
    <HeaderAndSteps>
      <>
        Deal each player the following <strong>{BASE_CARDS.length}</strong>{" "}
        action cards:{" "}
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map(BASE_CARDS, (card) => <strong>{card}</strong>)
          )}
        </GrammaticalList>
      </>
      <>
        Return all{" "}
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map(SIMPLE_MODE_CARDS, (card) => <strong>{card}</strong>)
          )}
        </GrammaticalList>{" "}
        cards back to the box.
      </>
      <>
        Shuffle the <strong>{NUM_ADVANCED_CARDS}</strong> cunning action cards.
      </>
      <>
        Secretly deal each player <strong>{ADVANCED_CARDS_PER_PLAYER}</strong>{" "}
        cards.
      </>
      {playerIds!.length < 4 && (
        <>
          Return any unused cunning action cards to the box without looking at
          them.
        </>
      )}
    </HeaderAndSteps>
  );
}

