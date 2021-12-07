import { Grid, Typography } from "@mui/material";
import { $, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";
import React, { useMemo } from "react";
import { InfraMods } from "../utils/InfraMods";
import infraModsVariant from "./infraModsVariant";

export default createRandomGameStep({
  id: "infraMods",
  dependencies: [playersMetaStep, infraModsVariant],

  isTemplatable: (_, isEnabled) => isEnabled.canResolveTo(true)!,

  skip: (_value, [_, isEnabled]) => !isEnabled,

  resolve: (_, playerIds, isEnabled) =>
    isEnabled ? InfraMods.randomIdx(playerIds!.length) : null,

  InstanceVariableComponent,
  InstanceManualComponent,

  instanceAvroType: "long",

  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Infra." subheader="Mods" />
  ),

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: infraModsIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);

  const infraMods = useMemo(
    () =>
      $(
        infraModsIdx,
        ($$) => InfraMods.decode($$, playerIds.length),
        ($$) => Vec.zip(playerIds, $$)
      ),
    [infraModsIdx, playerIds]
  );

  return (
    <>
      <Typography variant="body1">
        Each player takes the following <em>Infra Mod</em> tiles, chooses{" "}
        <strong>2</strong> of them, places them near their player mat face-up,
        then discards the remaining 2:
      </Typography>
      <Grid container marginTop={2} rowSpacing={2} alignItems="center">
        {Vec.map(infraMods, ([playerId, mods]) => (
          <React.Fragment key={`infraMods_${playerId}`}>
            <Grid item xs={2}>
              <PlayerAvatar playerId={playerId} inline />
            </Grid>
            <Grid item xs={10} lineHeight={1}>
              <GrammaticalList>
                {Vec.map(mods, (tileId) => (
                  <Typography
                    variant="caption"
                    fontSize="small"
                    sx={{ fontVariant: "small-caps" }}
                  >
                    <strong>{InfraMods.label(tileId)}</strong>
                  </Typography>
                ))}
              </GrammaticalList>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <IndexHashCaption idx={infraModsIdx} />
      <Rules />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <>
      <HeaderAndSteps synopsis="Each player:">
        <>
          Randomly draws <strong>4</strong> Infra Mods from the general supply.
          Players all draw, then make their choices simultaneously.
        </>
        <>
          Chooses <strong>2</strong> of them.
        </>
        <>Places them near their player mat, face-up.</>
        <>Discard the remaining 2.</>
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
      {/* copied from the manual, p. 7 */}
      {withSelectionRule && (
        <>
          When drawing Infrastructure Mods, discard any duplicates (from the
          draw) and draw replacements.{" "}
          <strong>You may only have 1 of each Mod</strong>.
        </>
      )}
      <strong>USING INFRASTRUCTURE MODS</strong>
      <>
        Each Infrastructure Mod may be used <strong>ONCE</strong> per game (flip
        it over).
      </>
      <>
        Each Infrastructure Mod has a triggering event that tells when it may be
        used. It may only be used at that time.
      </>
      <strong>INFRASTRUCTURE MOD CLARIFICATIONS</strong>
      <>
        <em>Machinery, Assembly Line, Construction, and Recruitment Office</em>{" "}
        all allow players to take actions without paying the associated cost.
        They do not provide bonus actions. You simply take the bottom-row action
        as usual, but do not have to pay the associated cost.
      </>
      <>
        <em>
          {/* Spell-checker: disable */}Automachines
          {/* Spell-checker: enable */}
        </em>{" "}
        doubles production output by workers and mills only for the turn on
        which you use it.
      </>
      <>
        <em>Spy, Propaganda, and Cavalry</em> are triggered by other actions. If
        you choose to use Spy, you must declare it at the very beginning of
        combat.
      </>
    </RulesSection>
  );
}
