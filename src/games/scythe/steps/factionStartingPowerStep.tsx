import { Stack, Typography } from "@mui/material";
import { Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { playerAssignments } from "../utils/playerAssignments";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "startingPower",

  dependencies: [
    productsMetaStep,
    factionsStep,
    playerMatsStep,
    playerAssignmentsStep,
  ],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, factionIds, boardsHash, order],
}: DerivedStepInstanceComponentProps<
  readonly ScytheProductId[],
  readonly FactionId[],
  string,
  readonly PlayerId[]
>): JSX.Element {
  const assignments = useMemo(
    () =>
      order == null
        ? null
        : playerAssignments(order, boardsHash, factionIds, productIds!),
    [boardsHash, factionIds, order, productIds]
  );

  const generalInstructions =
    "Each player puts the power token of their faction's color on the power track";

  if (factionIds == null) {
    return (
      <BlockWithFootnotes
        footnote={
          <>
            The number printed on the power icon, in the box at the right side
            of the mat.
          </>
        }
      >
        {(Footnote) => (
          <span>
            {generalInstructions}, using the faction mat
            <Footnote /> to determine the position.
          </span>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">{generalInstructions}:</Typography>
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
