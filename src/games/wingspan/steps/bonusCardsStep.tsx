import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "dealBonusCards",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <Typography variant="body1" textAlign="justify">
      {isSolo ? "Take" : "Deal each player"} <strong>2</strong> random bonus
      cards.
    </Typography>
  );
}
