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
      cards
      {
        // TODO: There are several ways we can expand this, a variant which
        // would make everything public knowledge, so we can also randomize the
        // bonus cards each player gets in this step, or a simpler variant where
        // only the selection (in the keep phase) is public knowledge, but that
        // doesn't change anything from our side.
        !isSolo && (
          <>
            ;{" "}
            <em>
              You may keep your bonus cards private or public throughout the
              game.
            </em>
          </>
        )
      }
      .
    </Typography>
  );
}
