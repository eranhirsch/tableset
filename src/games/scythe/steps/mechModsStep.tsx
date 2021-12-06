import { Stack, Typography } from "@mui/material";
import { $, tuple, Vec } from "common";
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
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { RulesSection } from "games/global/ux/RulesSection";
import React, { useMemo } from "react";
import { MechMods } from "../utils/MechMods";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import mechModsVariant from "./mechModsVariant";
import playerAssignmentsStep from "./playerAssignmentsStep";

// TODO: Vesna mech abilities step has some caveats regarding this step, we
// need to take that into account here...
export default createRandomGameStep({
  id: "mechMods",
  dependencies: [mechModsVariant, factionsStep],

  isTemplatable: (isEnabled, factions) =>
    isEnabled.canResolveTo(true)! && factions.willResolve(),

  skip: (_value, [isEnabled]) => !isEnabled,

  resolve: (_, isEnabled, factionIds) =>
    isEnabled && factionIds != null ? MechMods.randomIdx(factionIds) : null,

  InstanceVariableComponent,
  // TODO: InstanceManualComponent

  instanceAvroType: "long",

  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Mech" subheader="Mods" />
  ),

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: mechModsIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const factionIds = useRequiredInstanceValue(factionsStep);
  const assignments = useOptionalInstanceValue(playerAssignmentsStep);

  const mechMods = useMemo(
    () =>
      $(
        mechModsIdx,
        ($$) => MechMods.decode($$, factionIds),
        ($$) =>
          Vec.map(factionIds, (factionId, index) =>
            tuple(factionId, assignments?.[index], $$[index])
          )
      ),
    [assignments, factionIds, mechModsIdx]
  );

  return (
    <>
      <Typography variant="body1">
        Each player takes the following <em>Mech Mod</em> tiles, chooses{" "}
        <strong>
          1, 2, <em>or none</em>
        </strong>{" "}
        of them and places them <strong>over</strong> any of their faction's
        printed mech abilities, discarding the rest:
      </Typography>
      <Stack direction="column" marginTop={2} spacing={1}>
        {React.Children.toArray(
          Vec.map(mechMods, ([factionId, playerId, mods]) => (
            <span>
              {playerId != null ? (
                <PlayerAvatar playerId={playerId} inline />
              ) : (
                <FactionChip factionId={factionId} />
              )}
              :{" "}
              <GrammaticalList>
                {React.Children.toArray(Vec.map(mods, MechMods.label))}
              </GrammaticalList>
            </span>
          ))
        )}
      </Stack>
      <IndexHashCaption idx={mechModsIdx} />
      <RulesSection>
        <>
          Certain Mech Mods have a symbol to indicate they cannot be used
          against non-player units.
        </>
        <>After a game begins, you may not reorganize your Mods.</>
        <strong>MECH MOD CLARIFICATIONS:</strong>
        <>
          <em>ARMOR:</em> The attacker decides which card to discard.
        </>
        <>
          <em>FEINT:</em> After adjusting your combat dial, you must be able to
          pay the new Power total. You do not pay the original amount.
        </>
        <>
          <em>STEALTH:</em> If you use Stealth and another ability (Speed,
          Factory card, etc) to move through a territory where you would
          normally initiate combat, force workers to retreat, or trigger a token
          penalty, you completely ignore everything on that territory.
        </>
        <>
          <em>TACTICS:</em> Limited to once per combat.
        </>
      </RulesSection>
    </>
  );
}