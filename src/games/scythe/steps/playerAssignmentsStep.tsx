import { Chip, Stack } from "@mui/material";
import { Dict, invariant, MathUtils, nullthrows, Random, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { Faction, FactionId, Factions } from "../utils/Factions";
import { Mat, PlayerMats } from "../utils/PlayerMats";
import factionsStep from "./factionsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createRandomGameStep({
  id: "playerAssignments",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    factionsStep,
    playerMatsStep,
  ],

  isTemplatable: (_players, _products, factions, playerMats) =>
    factions.willResolve() || playerMats.willResolve(),

  resolve: (_, players) =>
    Random.index(MathUtils.permutations_lazy_array(players!)),

  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: orderPermIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const factionIds = useOptionalInstanceValue(factionsStep);
  const playerMatsIdx = useOptionalInstanceValue(playerMatsStep);

  const assignments = useMemo(
    () =>
      playerAssignments(
        orderPermIdx,
        playerMatsIdx,
        factionIds,
        playerIds,
        productIds
      ),
    [factionIds, orderPermIdx, playerIds, playerMatsIdx, productIds]
  );

  return (
    <>
      <BlockWithFootnotes
        footnote={
          <InstanceStepLink
            step={factionIds == null ? factionsStep : playerMatsStep}
          />
        }
      >
        {(Footnote) => (
          <>
            Players take their assigned{" "}
            {factionIds == null ? (
              <>
                player mat and the faction paired with that mat
                <Footnote />
              </>
            ) : playerMatsIdx == null ? (
              <>
                faction and the player mat paired with that faction
                <Footnote />
              </>
            ) : (
              "faction and player mat combo"
            )}
            :
          </>
        )}
      </BlockWithFootnotes>
      <Stack direction="column" spacing={1} padding={1}>
        {Vec.map_with_key(assignments, (playerId, [faction, mat]) => (
          <PlayerAssignment
            key={`${playerId}_assignment`}
            playerId={playerId}
            faction={faction}
            mat={mat}
          />
        ))}
      </Stack>
    </>
  );
}

function PlayerAssignment({
  playerId,
  faction,
  mat,
}: {
  playerId: PlayerId;
  faction: Faction | null;
  mat: Mat | null;
}): JSX.Element {
  return (
    <span>
      <PlayerAvatar playerId={playerId} inline />:{" "}
      {faction != null ? (
        <Chip
          color={faction.color}
          label={mat != null ? `${mat.name} ${faction.name}` : faction.name}
        />
      ) : (
        mat!.name
      )}
    </span>
  );
}

function playerAssignments(
  playerAssignmentIdx: number,
  playerMatsIdx: number | null,
  factionIds: readonly FactionId[] | null,
  playerIds: readonly PlayerId[],
  productIds: readonly ScytheProductId[]
): Readonly<
  Record<
    PlayerId,
    readonly [faction: Readonly<Faction> | null, mat: Readonly<Mat> | null]
  >
> {
  invariant(
    factionIds != null || playerMatsIdx != null,
    `Can't compute player assignments when both factions and player mats are missing`
  );

  const playerMatIds =
    playerMatsIdx == null
      ? null
      : PlayerMats.decode(
          playerMatsIdx,
          playerIds.length,
          factionIds != null,
          productIds
        );

  invariant(
    factionIds == null || factionIds.length === playerIds.length,
    `Not enough factions: ${JSON.stringify(factionIds)}, expected ${
      playerIds.length
    }`
  );

  invariant(
    playerMatIds == null || playerMatIds.length === playerIds.length,
    `Not enough player mats: ${JSON.stringify(playerMatIds)}, expected ${
      playerIds.length
    }`
  );

  return Dict.associate(
    nullthrows(
      MathUtils.permutations_lazy_array(playerIds).at(playerAssignmentIdx),
      `Idx ${playerAssignmentIdx} overflow for players ${playerIds}`
    ),
    // Create tuples of factions and mats
    Vec.zip(
      factionIds != null
        ? Vec.map(factionIds, (fid) => Factions[fid])
        : Vec.fill(playerIds.length, null),
      playerMatIds != null
        ? Vec.map(playerMatIds, (mid) => PlayerMats[mid])
        : Vec.fill(playerIds.length, null)
    )
  );
}
