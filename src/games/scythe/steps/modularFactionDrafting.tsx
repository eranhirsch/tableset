import { AvatarGroup, Typography } from "@mui/material";
import { Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { PlayerMats } from "../utils/PlayerMats";
import modularBoardVariant from "./modularBoardVariant";
import playerAssignmentsStep from "./playerAssignmentsStep";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "factionDrafting",
  labelOverride: "Modular: Faction Drafting",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    modularBoardVariant,
    playerMatsStep,
    playerAssignmentsStep,
  ],
  skip: ([_players, _products, isModular]) => !isModular,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, productIds, _, playerMatsHash, assignments],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean,
  string,
  readonly PlayerId[]
>): JSX.Element {
  const playerMatIds = useMemo(
    () =>
      playerMatsHash == null
        ? null
        : PlayerMats.decode(
            playerMatsHash,
            playerIds!.length,
            false /* forFactions */,
            productIds!
          ),
    [playerIds, playerMatsHash, productIds]
  );

  if (playerMatIds == null) {
    return <div>TODO: simple instructions</div>;
  }

  if (assignments == null) {
    return <div>TODO: Just say the order of the mats is</div>;
  }

  return (
    <>
      <Typography variant="body1">
        Each player picks an available faction, going in the following order:
      </Typography>
      <AvatarGroup sx={{ justifyContent: "center" }}>
        {Vec.map(
          Vec.map(
            Vec.reverse(
              Vec.sort_by(
                Vec.zip(playerMatIds, assignments),
                ([mid]) => PlayerMats[mid].rank
              )
            ),
            ([_, playerId]) => playerId
          ),
          (playerId) => (
            <PlayerAvatar key={playerId} playerId={playerId} />
          )
        )}
      </AvatarGroup>
    </>
  );
}
