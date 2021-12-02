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
import baselessFactionsStep from "./baselessFactionsStep";
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
    baselessFactionsStep,
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
    baselessBases,
  ],
}: DerivedStepInstanceComponentProps<
  readonly ScytheProductId[],
  readonly FactionId[],
  number,
  readonly PlayerId[],
  boolean,
  number,
  readonly FactionId[]
>): JSX.Element {
  const assignmentIds = useMemo(
    () =>
      order == null
        ? null
        : Combos.idsWithPlayerIds(
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
            ($$) => Shape.filter($$, ({ order }) => order != null),
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

  if (
    factionIds == null ||
    (factionIds.some((fid) => Factions[fid].order == null) &&
      baselessBases == null)
  ) {
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

  const baseless: Readonly<Partial<Record<FactionId, FactionId>>> =
    baselessBases == null
      ? {}
      : $(
          Vec.filter(factionIds, (fid) => Factions[fid].order == null),
          Vec.sort,
          ($$) => Dict.associate($$, baselessBases)
        );

  return (
    <>
      <Typography variant="body1">
        {header}:
        {assignmentIds == null && (
          <>
            {" "}
            <GrammaticalList>
              {$(
                Shape.select_keys(Factions, factionIds),
                ($$) =>
                  Dict.sort_by_with_key(
                    $$,
                    (fid, { order }) => order ?? Factions[baseless[fid]!].order
                  ),
                ($$) =>
                  Vec.map_with_key($$, (_, { color, name: { short } }) => (
                    <Chip size="small" color={color} label={short} />
                  ))
              )}
            </GrammaticalList>
            .
          </>
        )}
      </Typography>
      {assignmentIds != null && (
        <AvatarGroup sx={{ justifyContent: "center" }}>
          {" "}
          {Vec.map_with_key(
            Dict.sort_by(
              assignmentIds,
              ([fid]) => Factions[fid!].order ?? Factions[baseless[fid!]!].order
            ),
            (playerId) => (
              <PlayerAvatar playerId={playerId} />
            )
          )}
        </AvatarGroup>
      )}
    </>
  );
}
