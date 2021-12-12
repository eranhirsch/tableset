import { Typography } from "@mui/material";
import { Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { PlayerAvatarsList } from "games/core/ux/PlayerAvatarsList";
import { fullPlayOrder, playersMetaStep } from "games/global";
import React from "react";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MapId, MAPS, mapsForProducts } from "../utils/MAPS";
import RomanTitle from "../ux/RomanTitle";
import firstPlayerStep from "./firstPlayerStep";
import mapStep from "./mapStep";
import playOrderStep from "./playOrderStep";
import productsMetaStep from "./productsMetaStep";
import teamPlayVariant from "./teamPlayVariant";

export default createDerivedGameStep({
  id: "startingColonists",
  dependencies: [
    playersMetaStep,
    mapStep,
    productsMetaStep,
    teamPlayVariant,
    firstPlayerStep,
    playOrderStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    mapId,
    productIds,
    teamPlay,
    firstPlayerId,
    playOrder,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  MapId,
  readonly ConcordiaProductId[],
  boolean,
  PlayerId,
  readonly PlayerId[]
>): JSX.Element {
  if (mapId == null) {
    return (
      <UnknownMap
        availableMaps={productIds != null ? mapsForProducts(productIds) : null}
        teamPlay={teamPlay ?? false}
        firstPlayerId={firstPlayerId}
        playOrder={playOrder}
        playerIds={playerIds!}
      />
    );
  }

  const { startingColonists } = MAPS[mapId];
  return startingColonists[0].locationName !==
    startingColonists[1].locationName ? (
    <DifferentLocations
      colonists={startingColonists}
      teamPlay={teamPlay ?? false}
      firstPlayerId={firstPlayerId}
      playOrder={playOrder}
      playerIds={playerIds!}
    />
  ) : (
    <SameLocation
      colonists={startingColonists}
      teamPlay={teamPlay ?? false}
      firstPlayerId={firstPlayerId}
      playOrder={playOrder}
      playerIds={playerIds!}
    />
  );
}

function DifferentLocations({
  colonists,
  teamPlay,
  firstPlayerId,
  playOrder,
  playerIds,
}: {
  colonists: typeof MAPS[MapId]["startingColonists"];
  teamPlay: boolean;
  firstPlayerId: PlayerId | null | undefined;
  playOrder: readonly PlayerId[] | null | undefined;
  playerIds: readonly PlayerId[];
}): JSX.Element {
  const regularPlacement = (
    <GrammaticalList>
      {React.Children.toArray(
        colonists.map(({ type, locationName }) => (
          <>
            1 <strong>{type}</strong> colonist from their storehouse and place
            it in{" "}
            <strong>
              <RomanTitle>{locationName}</RomanTitle>
            </strong>
          </>
        ))
      )}
    </GrammaticalList>
  );
  if (!teamPlay) {
    return (
      <Typography variant="body1">Players take {regularPlacement}.</Typography>
    );
  }

  const synopsis = "Players place their starting colonists:";
  const teamPlacement = (
    <>
      take 2 colonists from their storehouse and each one picks a city except{" "}
      <GrammaticalList finalConjunction="or">
        {React.Children.toArray(
          Vec.concat(
            Vec.map(colonists, ({ locationName }) => (
              <RomanTitle>{locationName}</RomanTitle>
            )),
            <>any city connected to them by land paths or sea paths</>
          )
        )}
      </GrammaticalList>{" "}
      and places both of their colonists there.
      <br />
      <TeamColonistCaveat />
    </>
  );

  if (firstPlayerId == null || playOrder == null) {
    return (
      <HeaderAndSteps synopsis={synopsis}>
        <BlockWithFootnotes
          footnotes={[
            <InstanceStepLink step={playOrderStep} />,
            <InstanceStepLink step={firstPlayerStep} />,
          ]}
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
              <Footnote index={1} /> the first {playerIds.length / 2} players
              take {regularPlacement}.
            </>
          )}
        </BlockWithFootnotes>
        <>
          The remaining {playerIds.length / 2} players {teamPlacement}.
        </>
      </HeaderAndSteps>
    );
  }

  const order = fullPlayOrder(playerIds, playOrder, firstPlayerId);
  return (
    <HeaderAndSteps synopsis={synopsis}>
      <>
        <PlayerAvatarsList playerIds={Vec.take(order, playerIds.length / 2)} />{" "}
        take {regularPlacement}.
      </>
      <>
        <PlayerAvatarsList playerIds={Vec.drop(order, playerIds.length / 2)} />{" "}
        {teamPlacement}.
      </>
    </HeaderAndSteps>
  );
}

function SameLocation({
  colonists,
  teamPlay,
  firstPlayerId,
  playOrder,
  playerIds,
}: {
  colonists: typeof MAPS[MapId]["startingColonists"];
  teamPlay: boolean;
  firstPlayerId: PlayerId | null | undefined;
  playOrder: readonly PlayerId[] | null | undefined;
  playerIds: readonly PlayerId[];
}): JSX.Element {
  const regularPlacement = (
    <>
      <GrammaticalList>
        {React.Children.toArray(
          colonists.map(({ type }) => (
            <>
              1 <strong>{type}</strong> colonist
            </>
          ))
        )}
      </GrammaticalList>{" "}
      from their storehouse and place them in{" "}
      <strong>
        <RomanTitle>{colonists[0].locationName}</RomanTitle>
      </strong>
    </>
  );

  if (!teamPlay) {
    return (
      <Typography variant="body1">Players take {regularPlacement}.</Typography>
    );
  }

  const synopsis = "Players place their starting colonists:";
  const teamPlacement = (
    <>
      take 2 colonists from their storehouse and each one picks a city except{" "}
      <RomanTitle>{colonists[0].locationName}</RomanTitle> or any city connected
      to it by land paths or sea paths and places both of their colonists there.
      <br />
      <TeamColonistCaveat />
    </>
  );
  if (firstPlayerId == null || playOrder == null) {
    return (
      <HeaderAndSteps synopsis={synopsis}>
        <BlockWithFootnotes
          footnotes={[
            <InstanceStepLink step={playOrderStep} />,
            <InstanceStepLink step={firstPlayerStep} />,
          ]}
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
              <Footnote index={1} /> the first {playerIds.length / 2} players
              take {regularPlacement}.
            </>
          )}
        </BlockWithFootnotes>
        <>
          The remaining {playerIds.length / 2} players {teamPlacement}.
        </>
      </HeaderAndSteps>
    );
  }

  const order = fullPlayOrder(playerIds, playOrder, firstPlayerId);
  return (
    <HeaderAndSteps synopsis={synopsis}>
      <>
        <PlayerAvatarsList playerIds={Vec.take(order, playerIds.length / 2)} />{" "}
        take {regularPlacement}.
      </>
      <>
        <PlayerAvatarsList playerIds={Vec.drop(order, playerIds.length / 2)} />{" "}
        {teamPlacement}.
      </>
    </HeaderAndSteps>
  );
}

function UnknownMap({
  availableMaps,
  teamPlay,
  firstPlayerId,
  playOrder,
  playerIds,
}: {
  availableMaps: readonly MapId[] | null;
  teamPlay: boolean;
  firstPlayerId: PlayerId | null | undefined;
  playOrder: readonly PlayerId[] | null | undefined;
  playerIds: readonly PlayerId[];
}): JSX.Element {
  const regularPlacement =
    "2 colonist meeples at the starting locations of the chosen map";
  const footnote =
    availableMaps == null ? (
      <>
        On most maps there will be a single <em>capital city</em> where 1{" "}
        <strong>land</strong> colonist and 1 <strong>sea</strong> colonist are
        placed; Some maps have a different location for the land colonist and a
        different location for the sea colonist.
      </>
    ) : (
      <GrammaticalList>
        {React.Children.toArray(
          Vec.map(availableMaps, (mapId) => (
            <>
              <strong>
                <RomanTitle>{MAPS[mapId].name}</RomanTitle>
              </strong>
              :{" "}
              <MapLocationsFootnote colonists={MAPS[mapId].startingColonists} />
            </>
          ))
        )}
      </GrammaticalList>
    );

  if (!teamPlay) {
    return (
      <BlockWithFootnotes footnote={footnote}>
        {(Footnote) => (
          <>
            Place {regularPlacement}
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  const synopsis = "Players place their starting colonists:";
  const teamPlacement = (
    <>
      2 colonists in any city except the regular starting location or any city
      connected to it by land paths or sea paths.
      <br />
      <TeamColonistCaveat />
    </>
  );

  if (firstPlayerId == null || playOrder == null) {
    return (
      <HeaderAndSteps synopsis={synopsis}>
        <BlockWithFootnotes
          footnotes={[
            <InstanceStepLink step={playOrderStep} />,
            <InstanceStepLink step={firstPlayerStep} />,
            footnote,
          ]}
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
              <Footnote index={1} /> the first {playerIds.length / 2} players
              place {regularPlacement}
              <Footnote index={3} />.
            </>
          )}
        </BlockWithFootnotes>
        <>
          The remaining {playerIds.length / 2} players place {teamPlacement}.
        </>
      </HeaderAndSteps>
    );
  }

  const order = fullPlayOrder(playerIds, playOrder, firstPlayerId);
  return (
    <HeaderAndSteps synopsis={synopsis}>
      <BlockWithFootnotes footnote={footnote}>
        {(Footnote) => (
          <>
            <PlayerAvatarsList playerIds={Vec.take(order, order.length / 2)} />{" "}
            place {regularPlacement}
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        <PlayerAvatarsList playerIds={Vec.drop(order, order.length / 2)} />
        place {teamPlacement}.
      </>
    </HeaderAndSteps>
  );
}

function MapLocationsFootnote({
  colonists,
}: {
  colonists: typeof MAPS[MapId]["startingColonists"];
}): JSX.Element {
  if (colonists[0].locationName === colonists[1].locationName) {
    return (
      <>
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map(colonists, ({ type }) => (
              <>
                1 <em>{type}</em> colonist
              </>
            ))
          )}
        </GrammaticalList>{" "}
        in{" "}
        <em>
          <RomanTitle>{colonists[0].locationName}</RomanTitle>
        </em>
      </>
    );
  }

  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map(colonists, ({ type, locationName }) => (
          <>
            1 <em>{type}</em> colonist in{" "}
            <em>
              <RomanTitle>{locationName}</RomanTitle>
            </em>
          </>
        ))
      )}
    </GrammaticalList>
  );
}

function TeamColonistCaveat(): JSX.Element {
  return (
    <em>
      If the city is only connected by one type of connection only put colonists
      of that type, otherwise put one of each
    </em>
  );
}