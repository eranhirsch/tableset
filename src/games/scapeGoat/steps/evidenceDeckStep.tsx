import { Typography } from "@mui/material";
import { $, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React from "react";

export const CARDS_PER_PLAYER_COUNT = [0, 0, 13, 15, 22, 25] as const;

export default createDerivedGameStep({
  id: "evidenceDeck",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const count = playerIds!.length;
  return (
    <Typography variant="body1">
      Gather all <strong>{CARDS_PER_PLAYER_COUNT[count - 1]}</strong> evidence
      cards with{" "}
      <GrammaticalList>
        {$(
          Vec.range(3, count < 6 ? count : 5),
          ($$) => Vec.map($$, (num) => `${num}+`),
          ($$) => Vec.concat($$, `${playerIds!.length}`),
          ($$) => Vec.map($$, ($$) => <ChosenElement>{$$}</ChosenElement>),
          React.Children.toArray
        )}
      </GrammaticalList>{" "}
      at the bottom right of each card, returning the rest to the box;{" "}
      <em>They will not be used</em>.
    </Typography>
  );
}
