import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { PlayerId } from "../../../features/players/playersSlice";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import Player from "../../global/ux/Player";

export default createDerivedGameStep({
  id: "startingMoney",
  dependencies: [
    createPlayersDependencyMetaStep(),
    playOrderStep,
    firstPlayerStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, playOrder, firstPlayerId],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId
>): JSX.Element | null {
  if (playerIds == null) {
    // We don't know who the players are so can't really say anything
    return <div>No Players</div>;
  }

  if (playOrder == null) {
    if (firstPlayerId == null) {
      // we don't know anything
      return <div>no order or first player</div>;
    }

    // We at least know who the first player is
    return <div>first player known, not order</div>;
  } else if (firstPlayerId == null) {
    // play order known, but not first player
    return <div>No first player, but order known</div>;
  }

  const fullPlayOrder = [playerIds[0], ...playOrder];
  const firstPlayerIdx = fullPlayOrder.findIndex(
    (playerId) => playerId === firstPlayerId
  );
  const order = fullPlayOrder
    .slice(firstPlayerIdx)
    .concat(fullPlayOrder.slice(0, firstPlayerIdx));

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="body1">
          Players receive sestertii from the bank in the following denomination
        </Typography>
      </Grid>
      {order.map((playerId, index) => (
        <React.Fragment key={playerId}>
          <Grid item xs={2}>
            <Player playerId={playerId} />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">{5 + index} Sestertii</Typography>
          </Grid>
          <Grid item xs={7} />{" "}
        </React.Fragment>
      ))}
    </Grid>
  );
}
