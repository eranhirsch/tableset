import { Avatar, Grid, Typography } from "@mui/material";
import { Str, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { StepId } from "games/core/IGame";
import { PlayerAvatar } from "games/global/ux/PlayerAvatar";
import { PlayerId } from "model/Player";
import React from "react";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import noStartingResourcesVariant from "./noStartingResourcesVariant";

export const STEP_ID: StepId = "startingMoney";

const STARTING_MONEY_BASE = 5;
const NO_RESOURCES_VARIANT_EXTRA = 20;

export default createDerivedGameStep({
  id: STEP_ID,
  dependencies: [
    createPlayersDependencyMetaStep(),
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
  true
>): JSX.Element | null {
  if (playerIds == null) {
    return (
      <HeaderAndSteps synopsis="Provide each player money from the bank:">
        <>
          Give the starting player <strong>{STARTING_MONEY_BASE}</strong>{" "}
          sestertii.
        </>
        <BlockWithFootnotes
          footnotes={[
            <>
              e.g. in a 3 player game, the first player would get{" "}
              <strong>{STARTING_MONEY_BASE}</strong> sestertii, the second
              player would get <strong>{STARTING_MONEY_BASE + 1}</strong>{" "}
              sestertii, and the last player would get{" "}
              <strong>{STARTING_MONEY_BASE + 2}</strong> sestertii.
            </>,
          ]}
        >
          {(Footnote) => (
            <>
              Go around the table giving each player 1 sestertii{" "}
              <strong>more</strong> than the amount given to the the player
              before them
              <Footnote index={1} />.
            </>
          )}
        </BlockWithFootnotes>
        {isNoStartingResourcesVariantEnabled != null && (
          <BlockWithFootnotes
            footnotes={[
              <>
                Due to playing with{" "}
                <InstanceStepLink step={noStartingResourcesVariant} />.
              </>,
            ]}
          >
            {(Footnote) => (
              <>
                Give each player an additional {NO_RESOURCES_VARIANT_EXTRA}{" "}
                sestertii
                <Footnote index={1} />.
              </>
            )}
          </BlockWithFootnotes>
        )}
      </HeaderAndSteps>
    );
  }

  const hasDefinedOrder = firstPlayerId != null && playOrder != null;
  let order: readonly JSX.Element[];
  if (hasDefinedOrder) {
    const fullPlayOrder = [playerIds[0], ...playOrder];
    const firstPlayerIdx = fullPlayOrder.findIndex(
      (playerId) => playerId === firstPlayerId
    );
    order = fullPlayOrder
      .slice(firstPlayerIdx)
      .concat(fullPlayOrder.slice(0, firstPlayerIdx))
      .map((playerId) => <PlayerAvatar playerId={playerId} inline />);
  } else {
    order = Vec.range(1, playerIds.length).map((playerIdx) =>
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

  return (
    <>
      <Typography variant="body1">
        Players receive sestertii from the bank in the following denominations
        {!hasDefinedOrder && <em> (by play order)</em>}:
      </Typography>
      <Grid container component="figure" spacing={1} alignItems="center">
        {order.map((player, index) => (
          <React.Fragment key={`starting_money_pos_${index}`}>
            <Grid item xs={2}>
              {player}
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">
                {STARTING_MONEY_BASE + NO_RESOURCES_VARIANT_EXTRA + index}{" "}
                Sestertii
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}
