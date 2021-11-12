import { Stack, Typography } from "@mui/material";
import { Shape, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { playerAssignments } from "../utils/playerAssignments";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "startingPower",

  dependencies: [productsMetaStep, factionsStep, playerAssignmentsStep],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, factionIds, order],
}: DerivedStepInstanceComponentProps<
  readonly ScytheProductId[],
  readonly FactionId[],
  readonly PlayerId[]
>): JSX.Element {
  const assignments = useMemo(
    () =>
      order == null || factionIds == null
        ? null
        : playerAssignments(
            order,
            null /* boardsHash */,
            factionIds,
            productIds!
          ),
    [factionIds, order, productIds]
  );

  const generalInstructions = (
    <>
      Each player puts their wooden <strong>power token</strong> on the power
      track on the bottom right side of the board
    </>
  );

  if (factionIds == null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            The number printed on the black <strong>power icon</strong>, in the
            box at the right side of the mat.
          </>,
          // TODO: When we introduce fenris and tesla some factions wouldn't be
          // available (for example in the modular board) so we can depend on
          // the home bases to filter out those factions.
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map_with_key(
                Shape.select_keys(
                  Factions,
                  Factions.availableForProducts(productIds!)
                ),
                (fid, { power }) => (
                  <>
                    <FactionChip factionId={fid} />: {power} power
                  </>
                )
              )
            )}
          </GrammaticalList>,
        ]}
      >
        {(Footnote) => (
          <>
            {generalInstructions}, using the <em>faction mat</em>
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
        ? Vec.map_with_key(assignments, (playerId, [faction]) => (
            <span key={playerId}>
              <PlayerAvatar playerId={playerId} inline />: {faction!.power}{" "}
              power.
            </span>
          ))
        : Vec.map(factionIds, (fid) => (
            <span key={fid}>
              For <FactionChip factionId={fid} />: {Factions[fid].power} power.
            </span>
          ))}
    </Stack>
  );
}
