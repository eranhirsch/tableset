import { Stack } from "@mui/material";
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
import { Combos } from "../utils/Combos";
import { FactionId, Factions } from "../utils/Factions";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "initialCombatCards",

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
        : Combos.objectsWithPlayers(
            order,
            null /* boardsHash */,
            factionIds,
            productIds!
          ),
    [factionIds, order, productIds]
  );

  const generalFootnote = (
    <>
      Players should keep the card <strong>values</strong> <em>secret</em> (but
      the <strong>number</strong> of cards is <em>public information</em>).
    </>
  );

  if (factionIds == null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            The number printed on the <strong>yellow card icon</strong>, in the
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
                (fid, { combatCards }) => (
                  <>
                    <FactionChip factionId={fid} />: {combatCards} cards
                  </>
                )
              )
            )}
          </GrammaticalList>,
          generalFootnote,
        ]}
      >
        {(Footnote) => (
          <>
            Deal each player a starting hand of <strong>combat cards</strong>{" "}
            using the <em>faction mat</em>
            <Footnote index={1} /> to determine the number of cards to deal
            <Footnote index={2} />
            <Footnote index={3} />.
          </>
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
