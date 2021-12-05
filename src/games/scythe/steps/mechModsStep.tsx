import { Dict } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { playersMetaStep } from "games/global";
import mechModsVariant from "./mechModsVariant";

const FACTION_ABILITIES = [
  "artillery",
  "camaraderie",
  "scout",
  "suiton",
  "sword",
  "township",
  "underpass",
] as const;
const NEW_ABILITIES = [
  "armor",
  "entrenched",
  "feint",
  "foothold",
  "pontoons",
  "regroup",
  "reinforce",
  "stealth",
  "tactics",
] as const;
const ALL_TILES = [...NEW_ABILITIES, ...FACTION_ABILITIES] as const;
type TileId = typeof ALL_TILES[number];
const TILES = Dict.merge(
  Dict.from_keys(FACTION_ABILITIES, () => 2),
  Dict.from_keys(NEW_ABILITIES, () => 3)
);

export default createRandomGameStep({
  id: "mechMods",
  dependencies: [playersMetaStep, mechModsVariant],
  isTemplatable: (_, isEnabled) => isEnabled.canResolveTo(true)!,
  skip: (_value, [_players, isEnabled]) => !isEnabled,

  resolve: (_, players, isEnabled) => (isEnabled ? 0 : null),

  InstanceVariableComponent,

  instanceAvroType: "long",

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  return <>{value}</>;
}
