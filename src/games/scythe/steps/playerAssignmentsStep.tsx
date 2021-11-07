import { Chip, Stack } from "@mui/material";
import { Random, Vec } from "common";
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
import { useMemo } from "react";
import { Faction } from "../utils/Factions";
import { playerAssignments } from "../utils/playerAssignments";
import { Mat } from "../utils/PlayerMats";
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

  resolve: (_, players) => Random.shuffle(players!),

  // TODO: Allow a config where players can be assigned partial combo options
  // taken from the `always` arrays of factions and player mats
  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: order,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const factionIds = useOptionalInstanceValue(factionsStep);
  const playerMatsIdx = useOptionalInstanceValue(playerMatsStep);

  const assignments = useMemo(
    () => playerAssignments(order, playerMatsIdx, factionIds, productIds),
    [factionIds, order, playerMatsIdx, productIds]
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
