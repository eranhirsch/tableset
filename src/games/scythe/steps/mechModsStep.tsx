import { Stack, Typography } from "@mui/material";
import { $, tuple, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { RulesSection } from "games/global/ux/RulesSection";
import React, { useMemo } from "react";
import { Factions } from "../utils/Factions";
import { HomeBases } from "../utils/HomeBases";
import { MechMods } from "../utils/MechMods";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import mechModsVariant from "./mechModsVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import productsMetaStep from "./productsMetaStep";

export default createRandomGameStep({
  id: "mechMods",
  dependencies: [mechModsVariant, factionsStep],

  isTemplatable: (isEnabled, factions) =>
    isEnabled.canResolveTo(true)! && factions.willResolve(),

  skip: (_value, [isEnabled]) => !isEnabled,

  resolve: (_, isEnabled, factionIds) =>
    isEnabled && factionIds != null ? MechMods.randomIdx(factionIds) : null,

  InstanceVariableComponent,
  InstanceManualComponent,

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

  const vesnaIndex = factionIds.indexOf("vesna");

  return (
    <>
      <Typography variant="body1">
        Each player takes the following <em>Mech Mod</em> tiles, chooses{" "}
        <strong>
          1, 2, <em>or none</em>
        </strong>{" "}
        of them and places them <strong>over</strong> any of their faction's
        printed mech abilities
        {vesnaIndex > -1 && (
          <em>
            {" "}
            (except{" "}
            {mechMods[vesnaIndex][1] != null ? (
              <PlayerAvatar playerId={mechMods[vesnaIndex][1]!} inline />
            ) : (
              <FactionChip factionId="vesna" />
            )}{" "}
            who doesn't place the mods yet)
          </em>
        )}
        , discarding the rest:
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
                {React.Children.toArray(
                  Vec.map(mods, (tileId) =>
                    MechMods.label(tileId).toLocaleUpperCase()
                  )
                )}
              </GrammaticalList>
            </span>
          ))
        )}
      </Stack>
      <IndexHashCaption idx={mechModsIdx} />
      <Rules />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const homeBasesIdx = useOptionalInstanceValue(modularHomeBasesStep);
  const availableFactions = useMemo(
    () =>
      homeBasesIdx != null
        ? HomeBases.decode(homeBasesIdx)
        : Factions.availableForProducts(productIds),
    [homeBasesIdx, productIds]
  );

  return (
    <>
      <HeaderAndSteps synopsis="Each player:">
        <>
          Randomly draws <strong>4</strong> Mech Mods from the general supply.
          Players all draw, then make their choices simultaneously.
        </>
        <>
          Chooses{" "}
          <strong>
            1, 2, <em>or none</em>
          </strong>{" "}
          of them.
        </>
        <>
          Places them <strong>over</strong> any of their faction's printed mech
          abilities
          {availableFactions.includes("vesna") && (
            <em>
              {" "}
              (except if <FactionChip factionId="vesna" /> are playing: they
              don't need to place them yet)
            </em>
          )}
          .
        </>
        <>Discard the rest.</>
      </HeaderAndSteps>
      <Rules withSelectionRule />
    </>
  );
}

function Rules({
  withSelectionRule = false,
}: {
  withSelectionRule?: boolean;
}): JSX.Element {
  return (
    <RulesSection>
      {withSelectionRule && (
        <>
          When drawing Mech Mods, discard any duplicates (e.g., from your draw,
          and abilities on your current faction mat) and draw replacements. You
          may only have 1 of each Mod.
        </>
      )}
      <>
        Certain Mech Mods have a symbol to indicate they cannot be used against
        non-player units.
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
        <em>STEALTH:</em> If you use Stealth and another ability (Speed, Factory
        card, etc) to move through a territory where you would normally initiate
        combat, force workers to retreat, or trigger a token penalty, you
        completely ignore everything on that territory.
      </>
      <>
        <em>TACTICS:</em> Limited to once per combat.
      </>
    </RulesSection>
  );
}