import { Stack, Typography } from "@mui/material";
import { Shape, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId } from "../utils/Factions";
import { playerAssignments } from "../utils/playerAssignments";
import { PlayerMats } from "../utils/PlayerMats";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "startingPopularity",
  dependencies: [
    playersMetaStep,
    factionsStep,
    productsMetaStep,
    playerMatsStep,
    playerAssignmentsStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, factionIds, productIds, matsHash, order],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly FactionId[],
  readonly ScytheProductId[],
  string,
  readonly PlayerId[]
>): JSX.Element {
  const matIds = useMemo(
    () =>
      matsHash == null
        ? null
        : PlayerMats.decode(
            matsHash,
            playerIds!.length,
            factionIds != null,
            productIds!
          ),
    [factionIds, matsHash, playerIds, productIds]
  );

  const assignments = useMemo(
    () =>
      order == null || matsHash == null
        ? null
        : playerAssignments(order, matsHash, factionIds, productIds!),
    [factionIds, matsHash, order, productIds]
  );

  const generalInstructions = (
    <>
      Each player puts their wooden heart-shaped{" "}
      <strong>popularity token</strong> on the popularity track on the left side
      of the board
    </>
  );

  if (matIds == null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            The number printed on the <strong>heart icon</strong>, in the box at
            the right side of the mat.
          </>,
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map_with_key(
                Shape.select_keys(
                  PlayerMats,
                  PlayerMats.availableForProducts(productIds!)
                ),
                (mid, { name, popularity }) => (
                  <React.Fragment key={mid}>
                    {name}: {popularity} popularity
                  </React.Fragment>
                )
              )
            )}
          </GrammaticalList>,
        ]}
      >
        {(Footnote) => (
          <>
            {generalInstructions}, using the <em>player mat</em>
            <Footnote index={1} /> to determine the position
            <Footnote index={2} />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">
        {generalInstructions} on the matching position:
      </Typography>
      {assignments != null
        ? Vec.map_with_key(assignments, (playerId, [_, mat]) => (
            <span key={playerId}>
              <PlayerAvatar playerId={playerId} inline />: {mat!.popularity}{" "}
              popularity.
            </span>
          ))
        : Vec.map_with_key(
            Shape.select_keys(PlayerMats, matIds),
            (mid, { name, popularity }) => (
              <span key={mid}>
                For <strong>{name}</strong>: {popularity} popularity.
              </span>
            )
          )}
    </Stack>
  );
}