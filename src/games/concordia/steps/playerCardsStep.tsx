import { invariant, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { PlayerAvatarsList } from "games/core/ux/PlayerAvatarsList";
import { fullPlayOrder, playersMetaStep } from "games/global";
import React from "react";
import { ConcordiaProductId } from "../ConcordiaProductId";
import RomanTitle from "../ux/RomanTitle";
import firstPlayerStep from "./firstPlayerStep";
import playOrderStep from "./playOrderStep";
import productsMetaStep from "./productsMetaStep";
import teamPlayVariant from "./teamPlayVariant";
import venusScoringVariant from "./venusScoringVariant";

const PLAYER_CARDS = {
  /* spell-checker: disable */
  base: [
    "Architect",
    "Diplomat",
    "Mercator",
    "Prefect",
    "Prefect",
    "Senator",
    "Tribune",
  ],
  venus: [
    "Architect",
    "Diplomat",
    "Magister",
    "Mercator",
    "Prefect",
    "Prefect",
    "Senator",
    "Tribune",
  ],
  team: [
    "Architect",
    "Diplomat",
    "Legatus",
    "Mercator",
    "Praetor",
    "Prefect",
    "Tribune",
  ],
  /* spell-checker: enable */
} as const;

export default createDerivedGameStep({
  id: "playerCards",
  labelOverride: "Player Hand",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    venusScoringVariant,
    firstPlayerStep,
    playOrderStep,
    teamPlayVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    products,
    venusScoring,
    firstPlayerId,
    playOrder,
    teamPlay,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ConcordiaProductId[],
  boolean,
  PlayerId,
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const relevantProduct = products!.includes("base")
    ? products!.includes("venus")
      ? "venus"
      : "base"
    : "venusBase";

  if (relevantProduct === "base") {
    invariant(
      !venusScoring && !teamPlay,
      `Team play (${teamPlay}) or Venus Scoring (${venusScoring}) enabled for a base only game: ${JSON.stringify(
        products
      )}`
    );
    return (
      <BlockWithFootnotes footnote={<CardsFootnote />}>
        {(Footnote) => (
          <>
            Each player takes to their hand the {PLAYER_CARDS.base.length} cards{" "}
            <em>of their color</em>
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  invariant(
    !venusScoring || !teamPlay,
    `Both venus scoring and team play can't be enabled at the same time`
  );
  return (
    <VenusCards
      isBase={relevantProduct === "venusBase"}
      venusScoring={venusScoring ?? false}
      teamPlay={teamPlay ?? false}
      playerIds={playerIds!}
      firstPlayerId={firstPlayerId}
      playOrder={playOrder}
    />
  );
}

function VenusCards({
  isBase,
  venusScoring,
  teamPlay,
  playerIds,
  firstPlayerId,
  playOrder,
}: {
  isBase: boolean;
  venusScoring: boolean;
  teamPlay: boolean;
  playerIds: readonly PlayerId[];
  firstPlayerId: PlayerId | undefined | null;
  playOrder: readonly PlayerId[] | undefined | null;
}): JSX.Element {
  if (venusScoring) {
    // Playing venus scoring is the simplest mode, we don't need to return any
    // cards to the box
    return (
      <>
        Each player takes to their hand{" "}
        <TakeCardsStep isBase={isBase} venusScoring />
      </>
    );
  }

  if (!teamPlay) {
    if (!isBase) {
      // When not playing with venus scoring or team play, and there are the
      // OG concordia cards available we just need to take them instead...
      return (
        <>
          Each player takes to their hand <TakeCardsStep />
        </>
      );
    }

    return (
      <HeaderAndSteps synopsis="Each player prepares their starting hand:">
        <>
          Take <TakeCardsStep isBase />
        </>
        <>
          Return the{" "}
          <strong>
            <RomanTitle>Magister</RomanTitle>
          </strong>{" "}
          card to the box.
        </>
      </HeaderAndSteps>
    );
  }

  if (firstPlayerId == null || playOrder == null) {
    // We can't say anything about the players and need to provide generic
    // instructions
    return (
      <HeaderAndSteps synopsis="Each player prepares their starting hand:">
        <>
          Take <TakeCardsStep isBase={isBase} teamPlay />
        </>
        <BlockWithFootnotes
          footnotes={Vec.concat(
            [<InstanceStepLink step={playOrderStep} />],
            firstPlayerId == null
              ? [<InstanceStepLink step={firstPlayerStep} />]
              : []
          )}
        >
          {(Footnote) => (
            <>
              Starting with{" "}
              {firstPlayerId != null ? (
                <PlayerAvatar playerId={firstPlayerId} inline />
              ) : (
                <>
                  the first player
                  <Footnote index={2} />
                </>
              )}{" "}
              and going around the table in turn order
              <Footnote index={1} />, the first {playerIds.length / 2} players
              return the{" "}
              <strong>
                <RomanTitle>Diplomat</RomanTitle>
              </strong>{" "}
              card back to the box.
            </>
          )}
        </BlockWithFootnotes>
        <>
          The remaining {playerIds.length / 2} players return the{" "}
          <strong>
            <RomanTitle>Architect</RomanTitle>
          </strong>{" "}
          card back to the box.
        </>
      </HeaderAndSteps>
    );
  }

  const order = fullPlayOrder(playerIds, playOrder, firstPlayerId);
  return (
    <HeaderAndSteps synopsis="Each player prepares their starting hand:">
      <>
        Take <TakeCardsStep isBase={isBase} teamPlay />
      </>
      <>
        <PlayerAvatarsList playerIds={Vec.take(order, order.length / 2)} />{" "}
        return the{" "}
        <strong>
          <RomanTitle>Diplomat</RomanTitle>
        </strong>{" "}
        card back to the box.
      </>
      <>
        <PlayerAvatarsList playerIds={Vec.drop(order, order.length / 2)} />{" "}
        return the{" "}
        <strong>
          <RomanTitle>Architect</RomanTitle>
        </strong>{" "}
        card back to the box.
      </>
    </HeaderAndSteps>
  );
}

function TakeCardsStep({
  isBase = false,
  venusScoring = false,
  teamPlay = false,
}: {
  isBase?: boolean;
  venusScoring?: boolean;
  teamPlay?: boolean;
}): JSX.Element {
  const icon = teamPlay ? (
    <>
      <strong>an interlocking circles icon</strong> (at the bottom right corner)
    </>
  ) : (
    <>
      <strong>a small pilar icon</strong> (at the bottom left corner)
    </>
  );

  return isBase ? (
    <BlockWithFootnotes
      footnote={
        <CardsFootnote venusScoring={venusScoring} teamPlay={teamPlay} />
      }
    >
      {(Footnote) => (
        <>
          the {PLAYER_CARDS[teamPlay ? "team" : "venus"].length} cards{" "}
          <em>of their color</em> with {icon}
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  ) : (
    <BlockWithFootnotes
      footnote={
        <CardsFootnote venusScoring={venusScoring} teamPlay={teamPlay} />
      }
    >
      {(Footnote) => (
        <>
          the{" "}
          {
            PLAYER_CARDS[venusScoring ? "venus" : teamPlay ? "team" : "base"]
              .length
          }{" "}
          cards <em>of their color</em> with{" "}
          {venusScoring || teamPlay ? "VENVS" : "CONCORDIA"}{" "}
          {(venusScoring || teamPlay) && <>and {icon}</>} on the back
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function CardsFootnote({
  venusScoring = false,
  teamPlay = false,
}: {
  venusScoring?: boolean;
  teamPlay?: boolean;
}): JSX.Element {
  return (
    <>
      <GrammaticalList>
        {Vec.map(
          PLAYER_CARDS[venusScoring ? "venus" : teamPlay ? "team" : "base"],
          (card) => (
            <React.Fragment key={card}>
              <RomanTitle>{card}</RomanTitle>
            </React.Fragment>
          )
        )}
      </GrammaticalList>
      .
    </>
  );
}
