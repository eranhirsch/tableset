import { AvatarGroup, Chip, Typography } from "@mui/material";
import { $, Dict, Shape, Vec } from "common";
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
import { Combos } from "../utils/Combos";
import { FactionId, Factions } from "../utils/Factions";
import { HomeBases } from "../utils/HomeBases";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
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
    modularBoardVariant,
    modularHomeBasesStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    productIds,
    factionIds,
    playerMatsIdx,
    order,
    isModular,
    modularBasesIndex,
  ],
}: DerivedStepInstanceComponentProps<
  readonly ScytheProductId[],
  readonly FactionId[],
  number,
  readonly PlayerId[],
  boolean,
  number
>): JSX.Element {
  const assignments = useMemo(
    () =>
      order == null
        ? null
        : Combos.objectsWithPlayers(
            order,
            playerMatsIdx,
            factionIds,
            productIds!
          ),
    [factionIds, order, playerMatsIdx, productIds]
  );

  const homeBases = useMemo(
    () =>
      isModular
        ? modularBasesIndex == null
          ? null
          : $(
              modularBasesIndex,
              HomeBases.decode,
              ($$) =>
                Vec.filter($$, (fid): fid is FactionId => fid !== "empty"),
              ($$) => Shape.from_keys($$, (fid) => Factions[fid])
            )
        : $(
            productIds!,
            Factions.availableForProducts,
            ($$) => Shape.select_keys(Factions, $$),
            ($$) => Dict.sort_by($$, ({ order }) => order)
          ),
    [isModular, modularBasesIndex, productIds]
  );

  const header = (
    <>
      Sit players around the table with each player near their faction's
      starting base
    </>
  );

  if (factionIds == null) {
    if (homeBases == null) {
      return (
        <Typography variant="body1">
          {header} and maintaining the order of the factions on the board.
        </Typography>
      );
    }

    return (
      <BlockWithFootnotes
        footnote={
          <>
            The order is{" "}
            <GrammaticalList>
              {Vec.map(
                Vec.filter_nulls(Vec.values(homeBases)),
                ({ color, name: { short } }) => (
                  <Chip size="small" color={color} label={short} />
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
                (_, { color, name: { short } }) => (
                  <Chip size="small" color={color} label={short} />
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
