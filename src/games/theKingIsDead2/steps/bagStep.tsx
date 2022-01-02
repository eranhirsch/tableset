import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import { NUM_FOLLOWERS_REMOVED_2P } from "../utils/Factions";
import courtStep from "./courtStep";

export default createDerivedGameStep({
  id: "bag",
  dependencies: [playersMetaStep, courtStep],
  skip: ([_playerIds, courtFactionIds]) => courtFactionIds == null,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, _courtFactionIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <Typography variant="body1">
      {playerIds!.length === 2 ? (
        <>
          Return <strong>{NUM_FOLLOWERS_REMOVED_2P}</strong> followers of each
          faction to the box, then place
        </>
      ) : (
        "Place"
      )}{" "}
      all remaining followers in the cloth bag.
    </Typography>
  );
}
