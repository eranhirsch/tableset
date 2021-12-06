import { Stack } from "@mui/material";
import { $, Dict, MathUtils, Random, Vec } from "common";
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
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { useMemo } from "react";
import { HomeBases } from "../utils/HomeBases";
import { ALL_VESNA_MECH_IDS, VESNA_MECH_ABILITIES } from "../utils/VesnaMechs";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import mechModsStep from "./mechModsStep";
import mechModsVariant from "./mechModsVariant";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import productsMetaStep from "./productsMetaStep";

export default createRandomGameStep({
  id: "vesnaMechs",
  labelOverride: "Vesna: Mech Abilities",

  dependencies: [
    productsMetaStep,
    factionsStep,
    modularBoardVariant,
    modularHomeBasesStep,
  ],

  isTemplatable: (products, factions, isModular, _homeBases) =>
    products.willContain("fenris")! &&
    ((isModular.canResolveTo(false) &&
      (!factions.willResolve() || factions.willContain("vesna") !== false)) ||
      // TODO: homeBases returns a `number`, not an array of HomeBaseIds, so we
      // can't query if it will contain vesna or not, for now we simply don't
      // perform this optimization, in the future if we can query on a different
      // type than the actual step instance type we can change this...
      isModular.canResolveTo(true)),

  resolve(_, _productIds, factionIds, _isModular, homeBasesIdx) {
    if (factionIds != null && !factionIds.includes("vesna")) {
      return null;
    }

    if (
      homeBasesIdx != null &&
      !HomeBases.decode(homeBasesIdx).includes("vesna")
    ) {
      return null;
    }

    return Random.index(
      MathUtils.combinations_lazy_array(ALL_VESNA_MECH_IDS, 6)
    );
  },

  skip: (_, [products, factionIds, _isModular, homeBasesIdx]) =>
    !products!.includes("fenris") ||
    (factionIds != null && !factionIds.includes("vesna")) ||
    (homeBasesIdx != null && !HomeBases.decode(homeBasesIdx).includes("vesna")),

  InstanceVariableComponent,
  InstanceManualComponent,
  // We are intentionally not providing instance cards for the results so that
  // if players haven't selected the Vesna faction yet (like in the modular
  // board) they shouldn't have this information available.
  InstanceCards: (props) => (
    <IndexHashInstanceCard title="Mechs" subheader="Vesna" {...props} />
  ),

  ...NoConfigPanel,

  instanceAvroType: "int",
});

function InstanceVariableComponent({
  value: mechIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const isMechMods = useRequiredInstanceValue(mechModsVariant);

  const vesnaAbilities = useMemo(
    () =>
      $(
        MathUtils.combinations_lazy_array(ALL_VESNA_MECH_IDS, 6).at(mechIdx),
        $.nullthrows(`Index ${mechIdx} out of range!`),
        ($$) => Dict.select_keys(VESNA_MECH_ABILITIES, $$),
        Vec.values
      ),
    [mechIdx]
  );

  return (
    <HeaderAndSteps synopsis={<MechAbilitiesSynopsis />}>
      <>
        Takes the cyan <em>Vesna Mech Ability</em> tiles:
        <Stack direction="column" paddingLeft={4}>
          {Vec.map(vesnaAbilities, (ability) => (
            <ChosenElement key={`vesnaMech_${ability}`}>
              {ability.toLocaleUpperCase()}
            </ChosenElement>
          ))}
        </Stack>
      </>
      {isMechMods && (
        <BlockWithFootnotes footnote={<InstanceStepLink step={mechModsStep} />}>
          {(Footnote) => (
            <>
              Combine these with the 2 Mech Mods selected previously
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Pick <strong>2, 3</strong>, <em>or</em> <strong>4</strong> of these.
      </>
      <>
        {/* copied from the manual, p. 22 */}
        Place 2 of those tokens on the blank spaces on your faction mat; if you
        choose a 3rd or 4th token, place them over your printed mech abilities
        (Riverwalk and Speed).
      </>
      <>Set aside unused tokens.</>
    </HeaderAndSteps>
  );
}

function InstanceManualComponent(): JSX.Element {
  const isMechMods = useRequiredInstanceValue(mechModsVariant);

  return (
    <HeaderAndSteps synopsis={<MechAbilitiesSynopsis />}>
      <>
        Shuffle the <strong>18</strong> cyan <em>Vesna Mech Ability</em> tiles.
      </>
      <>
        Draw <strong>6</strong> tiles.
      </>
      {isMechMods && (
        <BlockWithFootnotes footnote={<InstanceStepLink step={mechModsStep} />}>
          {(Footnote) => (
            <>
              Combine these with the 2 Mech Mods selected previously
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Pick <strong>2, 3</strong>, <em>or</em> <strong>4</strong> of these.
      </>
      <>
        {/* copied from the manual, p. 22 */}
        Place 2 of those tokens on the blank spaces on your faction mat; if you
        choose a 3rd or 4th token, place them over your printed mech abilities
        (Riverwalk and Speed).
      </>
      <>Set aside unused tokens.</>
    </HeaderAndSteps>
  );
}

function MechAbilitiesSynopsis(): JSX.Element {
  const factionIds = useOptionalInstanceValue(factionsStep);
  const assignments = useOptionalInstanceValue(playerAssignmentsStep);

  return (
    <>
      {factionIds != null ? (
        assignments != null ? (
          <PlayerAvatar
            playerId={assignments[factionIds.indexOf("vesna")]}
            inline
          />
        ) : (
          <>
            The player with <FactionChip factionId="vesna" inline />
          </>
        )
      ) : (
        <>
          <em>
            If playing with <FactionChip factionId="vesna" inline />
          </em>
          : That player
        </>
      )}{" "}
      choses their mech abilities:
    </>
  );
}