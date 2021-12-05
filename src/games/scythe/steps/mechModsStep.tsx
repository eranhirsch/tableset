import { $, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { FactionId } from "../utils/Factions";
import factionsStep from "./factionsStep";
import mechModsVariant from "./mechModsVariant";

const FACTION_ABILITIES = [
  // spell-checker: disable
  "artillery",
  "camaraderie",
  "scout",
  "suiton",
  "sword",
  "township",
  "underpass",
] as const;

const FACTION_ABILITY: Readonly<
  Required<Record<typeof FACTION_ABILITIES[number], FactionId>>
> = {
  artillery: "nordic",
  camaraderie: "polania",
  scout: "crimea",
  suiton: "togawa",
  sword: "albion",
  township: "rusviet",
  underpass: "saxony",
};

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
  // spell-checker: enable
] as const;

const ALL_TILES = [...NEW_ABILITIES, ...FACTION_ABILITIES] as const;
type TileId = typeof ALL_TILES[number];

const TILES = $(
  // There are 2 copies of each faction-specific ability
  Vec.map(FACTION_ABILITIES, (ability) => Vec.fill(2, ability as TileId)),
  ($$) =>
    Vec.concat(
      $$,
      // There are 3 copies of each mech-mod only ability
      Vec.map(NEW_ABILITIES, (ability) => Vec.fill(3, ability as TileId))
    ),
  Vec.flatten,
  Vec.sort
);

export default createRandomGameStep({
  id: "mechMods",
  dependencies: [playersMetaStep, mechModsVariant, factionsStep],

  isTemplatable: (_, isEnabled, factions) =>
    isEnabled.canResolveTo(true)! && factions.willResolve(),

  skip: (_value, [_players, isEnabled]) => !isEnabled,

  resolve: (_, _players, isEnabled) =>
    isEnabled
      ? // TODO
        0
      : null,

  InstanceVariableComponent,

  instanceAvroType: "long",

  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Mods" subheader="Mech" />
  ),

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  // TODO
  return <>{value}</>;
}
