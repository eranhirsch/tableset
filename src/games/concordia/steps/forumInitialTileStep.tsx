import { Grid, Paper } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { useOptionalInstanceValue } from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { playersSelectors } from "features/players/playersSlice";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import {
  NoSettingsConfigPanel,
  NoSettingsConfigPanelTLDR,
} from "games/core/ux/NoSettingsConfigPanel";
import { firstPlayerStep, fullPlayOrder, playOrderStep } from "games/global";
import { PlayerId } from "model/Player";
import React from "react";
import { FORUM_TILES } from "../utils/FORUM_TILES";
import RomanTitle from "../ux/RomanTitle";
import forumDecksStep from "./forumDecksStep";
import forumExpertAuctionVariant from "./forumExpertAuctionVariant";
import forumVariantStep from "./forumVariantStep";

export default createRandomGameStep({
  id: "forumInitial",
  labelOverride: "Forum Starting Tile",
  dependencies: [forumVariantStep, forumExpertAuctionVariant, playersMetaStep],
  skip: (_, [forum]) => forum == null,
  isTemplatable: (_, auction) => auction.canResolveTo(true),
  initialConfig: (): true => true,
  resolve: (_config, _isForum, isAuction, players) =>
    isAuction != null && isAuction
      ? Vec.sample(FORUM_TILES.patrician.tiles, players!.length + 1)
      : null,
  refresh: () => templateValue("unchanged"),
  InstanceVariableComponent,
  InstanceManualComponent,
  ConfigPanel: NoSettingsConfigPanel,
  ConfigPanelTLDR: NoSettingsConfigPanelTLDR,
});

function InstanceVariableComponent({
  value: patricians,
}: VariableStepInstanceComponentProps<readonly string[]>): JSX.Element {
  return <AuctionMode patricians={patricians} />;
}

function InstanceManualComponent(): JSX.Element {
  const auctionMode = useOptionalInstanceValue(forumExpertAuctionVariant);

  if (auctionMode) {
    return <AuctionMode />;
  }

  return (
    <HeaderAndSteps synopsis="Each player picks a starting forum Patrician tile:">
      <ShufflePatricians />
      <>
        Players get <strong>2</strong> Patrician tiles each.
      </>
      <>
        Each player picks <strong>1</strong> Patrician tile that they would
        keep, <em>and returns the other to the deck</em>.{" "}
      </>
    </HeaderAndSteps>
  );
}

function AuctionMode({
  patricians,
}: {
  patricians?: readonly string[];
}): JSX.Element {
  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];
  const firstPlayer = useOptionalInstanceValue(firstPlayerStep);
  const playOrder = useOptionalInstanceValue(playOrderStep);

  return (
    <HeaderAndSteps synopsis="Players bid points from their final score to win a forum card:">
      {patricians == null ? (
        <ShufflePatricians />
      ) : (
        <InstancePatricians patricians={patricians} />
      )}
      {patricians == null && (
        <>
          Draw {playerIds.length + 1} tiles from the deck and lay them on the
          table.
        </>
      )}
      <>
        {firstPlayer != null ? (
          <PlayerAvatar playerId={firstPlayer} inline />
        ) : (
          <>The first player</>
        )}{" "}
        picks one of the cards on display and bids <em>0 or more</em> points for
        it.
      </>
      <>
        In play order around the table each player can now bid{" "}
        <em>1 or more</em> points more than the current bid, or{" "}
        <strong>pass</strong> on this tile.
      </>
      <>
        Continue around the table, skipping players who have passed, until all
        players <em>but one</em> have passed.
      </>
      <>The last player to bid takes that forum tile.</>
      <BlockWithFootnotes
        footnote={
          <>
            e.g. if they bid 4 points, they would put their score marker on{" "}
            <em>96</em>
          </>
        }
      >
        {(Footnote) => (
          <>
            That player also moves his score marker <em>backwards</em> on the
            score track as many points as they have bid
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        <em>While there are still 3 or more tiles on the table:</em> go back to
        step 2. Players who already won a forum tile <strong>do not</strong>{" "}
        participate in the following auction rounds.
        <em>If the first player already won a forum tile:</em> the next player
        in play order
        {playOrder != null && firstPlayer != null && (
          <>
            {", "}
            <PlayerAvatar
              playerId={fullPlayOrder(playerIds, playOrder, firstPlayer)[1]}
              inline
            />
            {", "}
          </>
        )}{" "}
        will pick a forum tile to bid on (and so forth).
      </>
      <>
        The only player who doesn't have a forum tile yet now picks one of the
        two remaining tiles without bidding anything.
      </>
      <>Return the remaining tile to the deck.</>
    </HeaderAndSteps>
  );
}

function ShufflePatricians(): JSX.Element {
  return (
    <BlockWithFootnotes footnote={<InstanceStepLink step={forumDecksStep} />}>
      {(Footnote) => (
        <>
          Shuffle the Patricians deck
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function InstancePatricians({
  patricians,
}: {
  patricians: readonly string[];
}): JSX.Element {
  return (
    <>
      Find the following Patrician forum tiles and lay them out on the table:{" "}
      <Grid container spacing={1}>
        {React.Children.toArray(
          Vec.map(patricians, (patrician) => (
            <Grid item xs={4}>
              <Paper
                elevation={1}
                sx={{ height: 50, textAlign: "center", paddingY: "auto" }}
              >
                <RomanTitle>{patrician}</RomanTitle>
              </Paper>
            </Grid>
          ))
        )}
        {patricians.length % 3 > 0 && <Grid item xs={4} />}
        {patricians.length % 3 === 1 && <Grid item xs={4} />}
      </Grid>
    </>
  );
}
