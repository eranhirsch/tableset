import { Avatar, Grid, Typography } from "@mui/material";
import { Str, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { firstPlayerStep, playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React from "react";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import noStartingResourcesVariant from "./noStartingResourcesVariant";
import playOrderStep from "./playOrderStep";

const STARTING_MONEY_BASE = 5;
const NO_RESOURCES_VARIANT_EXTRA = 20;

export default createDerivedGameStep({
  id: "startingMoney",
  dependencies: [
    playersMetaStep,
    playOrderStep,
    firstPlayerStep,
    noStartingResourcesVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    playOrder,
    firstPlayerId,
    isNoStartingResourcesVariantEnabled,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId,
  boolean
>): JSX.Element {
  if (playerIds == null) {
    return (
      <NoPlayers withExtraSestertii={isNoStartingResourcesVariantEnabled} />
    );
  }

  return (
    <>
      <Typography variant="body1">
        Players receive sestertii from the bank in the following denominations
        {(firstPlayerId == null || playOrder == null) && (
          <em> (by play order)</em>
        )}
        :
      </Typography>
      <Grid container component="figure" spacing={1} alignItems="center">
        {React.Children.toArray(
          playerAvatars(playerIds, playOrder, firstPlayerId).map(
            (player, index) => (
              <>
                <Grid item xs={2}>
                  {player}
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    {STARTING_MONEY_BASE +
                      (isNoStartingResourcesVariantEnabled
                        ? NO_RESOURCES_VARIANT_EXTRA
                        : 0) +
                      index}{" "}
                    Sestertii
                  </Typography>
                </Grid>
              </>
            )
          )
        )}
      </Grid>
    </>
  );
}

function NoPlayers({
  withExtraSestertii,
}: {
  withExtraSestertii: boolean | null | undefined;
}): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Provide each player money from the bank:">
      <>
        Give the starting player <strong>{STARTING_MONEY_BASE}</strong>{" "}
        sestertii.
      </>
      <BlockWithFootnotes
        footnote={
          <>
            e.g. in a 3 player game, the first player would get{" "}
            <strong>{STARTING_MONEY_BASE}</strong> sestertii, the second player
            would get <strong>{STARTING_MONEY_BASE + 1}</strong> sestertii, and
            the last player would get <strong>{STARTING_MONEY_BASE + 2}</strong>{" "}
            sestertii.
          </>
        }
      >
        {(Footnote) => (
          <>
            Go around the table giving each player 1 sestertii{" "}
            <strong>more</strong> than the amount given to the the player before
            them
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      {withExtraSestertii && (
        <BlockWithFootnotes
          footnote={<InstanceStepLink step={noStartingResourcesVariant} />}
        >
          {(Footnote) => (
            <>
              Give each player an additional {NO_RESOURCES_VARIANT_EXTRA}{" "}
              sestertii
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      )}
    </HeaderAndSteps>
  );
}

function playerAvatars(
  playerIds: readonly PlayerId[],
  playOrder: readonly PlayerId[] | null | undefined,
  firstPlayerId: PlayerId | null | undefined
): readonly JSX.Element[] {
  if (firstPlayerId != null && playOrder != null) {
    const fullPlayOrder = [playerIds[0], ...playOrder];
    const firstPlayerIdx = fullPlayOrder.findIndex(
      (playerId) => playerId === firstPlayerId
    );
    return Vec.map(Vec.rotate(fullPlayOrder, firstPlayerIdx), (playerId) => (
      <PlayerAvatar playerId={playerId} inline />
    ));
  }

  return Vec.range(1, playerIds.length).map((playerIdx) =>
    playerIdx === 1 && firstPlayerId != null ? (
      <PlayerAvatar playerId={firstPlayerId} inline />
    ) : (
      <Avatar sx={{ display: "inline-flex" }}>
        {playerIdx}
        {Str.number_suffix(playerIdx)}
      </Avatar>
    )
  );
}
