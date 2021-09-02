import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { PlayerId } from "../../../features/players/playersSlice";
import Player from "./Player";

export default function StartingMoney({
  order,
}: {
  order: readonly PlayerId[];
}) {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        Each player takes
      </Grid>
      {order.map((playerId, index) => (
        <React.Fragment key={playerId}>
          <Grid item xs={6}>
            <Player playerId={playerId} />
          </Grid>
          <Grid item xs={6}>
            {5 + index} Sestertii
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <Typography variant="caption">(from the bank)</Typography>
      </Grid>
    </Grid>
  );
}
