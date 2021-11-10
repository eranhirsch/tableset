import { Stack } from "@mui/material";
import { Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps
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
  id: "initialCombatCards",

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

  const generalFootnote = (
    <>
      Players should keep the card content secret (but the number of cards is
      public).
    </>
  );

  if (factionIds == null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            The number printed on the yellow card icon, in the box at the right
            side of the mat.
          </>,
          generalFootnote,
        ]}
      >
        {(Footnote) => (
          <span>
            Deal each player a starting hand of combat cards using the faction
            mat
            <Footnote index={1} /> to determine the number of cards to deal
            <Footnote index={2} />
          </span>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Stack direction="column" spacing={1}>
      <BlockWithFootnotes footnote={generalFootnote}>
        {(Footnote) => (
          <span>
            Deal each player a starting hand of combat cards
            <Footnote />:
          </span>
        )}
      </BlockWithFootnotes>
      {assignments != null
        ? Vec.map_with_key(assignments, (playerId, [faction]) => (
            <span key={playerId}>
              <PlayerAvatar playerId={playerId} inline />:{" "}
              {faction!.combatCards} cards.
            </span>
          ))
        : Vec.map(factionIds, (fid) => (
            <span key={fid}>
              For <FactionChip factionId={fid} />: {Factions[fid].combatCards}{" "}
              cards.
            </span>
          ))}
    </Stack>
  );
}
