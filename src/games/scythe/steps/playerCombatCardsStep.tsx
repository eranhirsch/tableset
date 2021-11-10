import { Stack } from "@mui/material";
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
import { HomeBases } from "../utils/HomeBases";
import { playerAssignments } from "../utils/playerAssignments";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import modularHomeBasesStep from "./modularHomeBasesStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "initialCombatCards",

  dependencies: [
    productsMetaStep,
    factionsStep,
    playerMatsStep,
    playerAssignmentsStep,
    modularHomeBasesStep,
  ],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, factionIds, boardsHash, order, homeBasesHash],
}: DerivedStepInstanceComponentProps<
  readonly ScytheProductId[],
  readonly FactionId[],
  string,
  readonly PlayerId[],
  string
>): JSX.Element {
  const assignments = useMemo(
    () =>
      order == null
        ? null
        : playerAssignments(order, boardsHash, factionIds, productIds!),
    [boardsHash, factionIds, order, productIds]
  );

  const usedFactionIds = useMemo(
    () =>
      factionIds != null
        ? factionIds
        : homeBasesHash == null
        ? null
        : HomeBases.decode(homeBasesHash),
    [factionIds, homeBasesHash]
  );

  if (usedFactionIds == null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            The number on top of the yellow card symbol in the box at the right
            of the mat.
          </>,
          <>
            Players should keep the card content secret (but the number of cards
            is public).
          </>,
        ]}
      >
        {(Footnote) => (
          <span>
            Deal each player a starting hand of combat cards using the faction
            mat
            <Footnote index={1} /> to determine the number of cards to deal
            <Footnote index={2} />:
          </span>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Stack direction="column" spacing={1}>
      <BlockWithFootnotes
        footnote={
          <>
            Players should keep the card content secret (but the number of cards
            is public).
          </>
        }
      >
        {(Footnote) => (
          <span>
            Deal each player a starting hand of combat cards
            <Footnote />:
          </span>
        )}
      </BlockWithFootnotes>
      {assignments != null && factionIds != null
        ? Vec.map_with_key(assignments, (playerId, [faction]) => (
            <span key={playerId}>
              <PlayerAvatar playerId={playerId} inline />:{" "}
              {faction!.combatCards} cards.
            </span>
          ))
        : Vec.map(
            Vec.filter(
              usedFactionIds,
              (fid): fid is FactionId => fid !== "empty"
            ),
            (fid) => (
              <span key={fid}>
                For <FactionChip factionId={fid} />: {Factions[fid].combatCards}{" "}
                cards.
              </span>
            )
          )}
    </Stack>
  );
}
