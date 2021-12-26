import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "startingProjects",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <>
      <Typography variant="body1" textAlign="justify">
        {isSolo ? "Draw" : "Deal each player"} <strong>10</strong>{" "}
        <ChosenElement extraInfo="cards">Project</ChosenElement>.
      </Typography>
      {!isSolo && (
        <Typography variant="body2" textAlign="justify">
          <em>Players should keep these cards hidden</em>.
        </Typography>
      )}
    </>
  );
}
