import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { useMemo } from "react";
import { MechMods } from "../utils/MechMods";
import factionsStep from "./factionsStep";
import mechModsVariant from "./mechModsVariant";

export default createRandomGameStep({
  id: "mechMods",
  dependencies: [mechModsVariant, factionsStep],

  isTemplatable: (isEnabled, factions) =>
    isEnabled.canResolveTo(true)! && factions.willResolve(),

  skip: (_value, [isEnabled]) => !isEnabled,

  resolve: (_, isEnabled, factionIds) =>
    isEnabled && factionIds != null ? MechMods.randomIdx(factionIds) : null,

  InstanceVariableComponent,

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
  const mechMods = useMemo(
    () => MechMods.decode(mechModsIdx, factionIds),
    [factionIds, mechModsIdx]
  );
  return <>{JSON.stringify(mechMods)}</>;
}
