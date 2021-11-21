import { Grid, Paper, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { useOptionalInstanceValue } from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { playersSelectors } from "features/players/playersSlice";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { firstPlayerStep, fullPlayOrder, playersMetaStep } from "games/global";
import { isIndexType } from "games/global/coercers/isIndexType";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ForumTiles } from "../utils/ForumTiles";
import RomanTitle from "../ux/RomanTitle";
import fishMarketVariant from "./fishMarketVariant";
import forumDecksStep from "./forumDecksStep";
import forumExpertAuctionVariant from "./forumExpertAuctionVariant";
import forumVariantStep from "./forumVariant";
import playOrderStep from "./playOrderStep";

export default createRandomGameStep({
  id: "forumInitial",
  labelOverride: "Forum Starting Tile",

  isType: isIndexType,

  dependencies: [
    forumVariantStep,
    forumExpertAuctionVariant,
    playersMetaStep,
    fishMarketVariant,
  ],
  skip: (_, [forum]) => forum == null,
  isTemplatable: (_, auction) => auction.canResolveTo(true),
  resolve: (_config, _isForum, isAuction, players) =>
    isAuction != null && isAuction
      ? ForumTiles.randomIndex(players!.length)
      : null,
  InstanceVariableComponent,
  InstanceManualComponent,

  ...NoConfigPanel,

  InstanceCards,
});

function InstanceVariableComponent({
  value: forumIndex,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const withFish = useOptionalInstanceValue(fishMarketVariant);
  return <AuctionMode forumIndex={forumIndex} withFish={withFish ?? false} />;
}

function InstanceManualComponent(): JSX.Element {
  const auctionMode = useOptionalInstanceValue(forumExpertAuctionVariant);
  const withFish = useOptionalInstanceValue(fishMarketVariant);

  if (auctionMode) {
    return <AuctionMode withFish={withFish ?? false} />;
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
  forumIndex,
  withFish,
}: {
  forumIndex?: number;
  withFish: boolean;
}): JSX.Element {
  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];
  const firstPlayer = useOptionalInstanceValue(firstPlayerStep);
  const playOrder = useOptionalInstanceValue(playOrderStep);

  return (
    <HeaderAndSteps synopsis="Players bid points from their final score to win a forum card:">
      {forumIndex == null ? (
        <ShufflePatricians />
      ) : (
        <InstancePatricians
          forumIndex={forumIndex}
          playerCount={playerIds.length}
        />
      )}
      {forumIndex == null && (
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
      {withFish ? (
        <BlockWithFootnotes
          footnote={
            <>
              e.g. if the player bid 4 points and scored 107 points at the end
              of the game, their final score would be 103
            </>
          }
        >
          {(Footnote) => (
            <>
              Take note of how many points that player bid; at the end of the
              game don't forget to check the notes and subtract points from the
              final total scores
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      ) : (
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
      )}
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
  forumIndex,
  playerCount,
}: {
  forumIndex: number;
  playerCount: number;
}): JSX.Element {
  const patricians = useMemo(
    () => ForumTiles.decode(forumIndex, playerCount),
    [forumIndex, playerCount]
  );

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
      <IndexHashCaption idx={forumIndex} />
    </>
  );
}

function InstanceCards({
  value: index,
  dependencies: [_isForum, _isForumAuction, playerIds, _isFish],
}: InstanceCardsProps<
  number,
  boolean,
  boolean,
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const tiles = useMemo(
    () => ForumTiles.decode(index, playerIds!.length),
    [index, playerIds]
  );
  return (
    <>
      {Vec.map(tiles, (tile) => (
        <InstanceCard key={tile} title="Auction" subheader="Forum">
          <Typography variant="body1" color="primary">
            <strong>
              <RomanTitle>{tile}</RomanTitle>
            </strong>
          </Typography>
        </InstanceCard>
      ))}
    </>
  );
}
