import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { PlayerId } from "../../../features/players/playersSlice";
import { DerivedStepInstanceComponentProps } from "../../core/steps/createDerivedGameStep";
import Player from "../../global/ux/Player";

export default function StartingMoney({
  context: { playerIds },
  dependencies: [playOrder, firstPlayerId],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  PlayerId
>): JSX.Element | null {
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
          Player receive sestertii from the bank in the following amounts:
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
