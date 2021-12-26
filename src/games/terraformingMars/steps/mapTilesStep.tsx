import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "mapTiles",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Create a pile for the <strong>60</strong>{" "}
      <ChosenElement extraInfo="tiles">Greenery/City</ChosenElement>, and a pile
      for the <strong>11</strong>{" "}
      <ChosenElement extraInfo="tiles">Special</ChosenElement>
      {playerIds!.length > 1 && <> so that everyone can reach them</>}.
    </Typography>
  );
}
