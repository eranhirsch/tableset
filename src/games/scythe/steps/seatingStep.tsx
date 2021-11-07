import { AvatarGroup, Chip, Typography } from "@mui/material";
import { Dict, Shape, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { playerAssignments } from "../utils/playerAssignments";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "seating",
  dependencies: [
    productsMetaStep,
    factionsStep,
    playerMatsStep,
    playerAssignmentsStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, factionIds, playerMatsHash, order],
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
        : playerAssignments(order, playerMatsHash, factionIds, productIds!),
    [factionIds, order, playerMatsHash, productIds]
  );

  const header = (
    <>
      Sit players around the table with each player near their faction's
      starting base
    </>
  );

  if (factionIds == null) {
    return (
      <BlockWithFootnotes
        footnote={
          <>
            The order is{" "}
            <GrammaticalList>
              {Vec.map_with_key(
                Dict.sort_by(
                  Shape.select_keys(
                    Factions,
                    Factions.availableForProducts(productIds!)
                  ),
                  ({ order }) => order
                ),
                (_, { color, name }) => (
                  <Chip size="small" color={color} label={name} />
                )
              )}
            </GrammaticalList>
            .
          </>
        }
      >
        {(Footnote) => (
          <>
            {header} and maintaining the order of the factions on the board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <>
      <Typography variant="body1">
        {header}:
        {assignments == null && (
          <>
            {" "}
            <GrammaticalList>
              {Vec.map_with_key(
                Dict.sort_by(
                  Shape.select_keys(Factions, factionIds),
                  ({ order }) => order
                ),
                (_, { color, name }) => (
                  <Chip size="small" color={color} label={name} />
                )
              )}
            </GrammaticalList>
            .
          </>
        )}
      </Typography>
      {assignments != null && (
        <AvatarGroup sx={{ justifyContent: "center" }}>
          {" "}
          {Vec.map_with_key(
            Dict.sort_by(assignments, ([faction]) => faction!.order),
            (playerId) => (
              <PlayerAvatar playerId={playerId} />
            )
          )}
        </AvatarGroup>
      )}
    </>
  );
}
