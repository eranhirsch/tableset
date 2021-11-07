import { Typography } from "@mui/material";
import { C, Dict, Shape, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId } from "../utils/Factions";
import { playerAssignments } from "../utils/playerAssignments";
import { PlayerMats } from "../utils/PlayerMats";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "firstPlayer",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    factionsStep,
    playerMatsStep,
    playerAssignmentsStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    productIds,
    factionIds,
    playerMatsIdx,
    playerAssignmentIdx,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[],
  number,
  number
>): JSX.Element {
  const assignments = useMemo(
    () =>
      playerAssignmentIdx == null
        ? null
        : playerAssignments(
            playerAssignmentIdx,
            playerMatsIdx,
            factionIds,
            playerIds!,
            productIds!
          ),
    [factionIds, playerAssignmentIdx, playerIds, playerMatsIdx, productIds]
  );

  const matIds = useMemo(
    () =>
      playerMatsIdx == null
        ? null
        : PlayerMats.decode(
            playerMatsIdx,
            playerIds!.length,
            factionIds != null,
            productIds!
          ),
    [factionIds, playerIds, playerMatsIdx, productIds]
  );

  const turnOrder =
    "Turn order will continue in sequence clockwise around the table";

  if (matIds == null) {
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            On the top right corner of the box to the right of the board, where
            the name of the board is.
          </>,
          <>
            The player with the first player mat in this order:
            <GrammaticalList>
              {Vec.map_with_key(
                Dict.sort_by(
                  Shape.select_keys(
                    PlayerMats,
                    PlayerMats.availableForProducts(productIds!)
                  ),
                  ({ rank }) => rank
                ),
                (_, { name, rank }) => name
              )}
            </GrammaticalList>
            .
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            The player whose player mat has the lowest number
            <Footnote index={1} /> will go first
            <Footnote index={2} />. {turnOrder}.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  if (assignments == null) {
    return (
      <Typography variant="body1">
        The player with the{" "}
        <strong>
          {
            PlayerMats[
              C.firstx(Vec.sort_by(matIds, (mid) => PlayerMats[mid].rank))
            ].name
          }
        </strong>{" "}
        player mat will go first. {turnOrder}.
      </Typography>
    );
  }

  return (
    <Typography variant="body1">
      <PlayerAvatar
        playerId={C.firstx(
          Vec.keys(Dict.sort_by(assignments, ([_, mat]) => mat!.rank))
        )}
        inline
      />{" "}
      will go first. {turnOrder}.
    </Typography>
  );
}
