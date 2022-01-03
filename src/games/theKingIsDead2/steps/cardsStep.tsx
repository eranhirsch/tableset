import { Stack, Typography } from "@mui/material";
import { Vec } from "common";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import React from "react";

const CARDS = [
  /* Spell-checker: disable */
  "Scottish Support",
  "Welsh Support",
  "English Support",
  "Negotiate",
  "Manoeuvre",
  "Outmanoeuvre",
  "Assemble",
  "Assemble",
  /* Spell-checker: enable */
] as const;

export default createDerivedGameStep({
  id: "cards",
  dependencies: [],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Deal each player the following <strong>{CARDS.length}</strong> action
        cards:
      </Typography>
      <Stack marginTop={2} marginX={4} spacing={1}>
        {React.Children.toArray(
          Vec.map(CARDS, (card) => <strong>{card}</strong>)
        )}
      </Stack>
    </>
  );
}
