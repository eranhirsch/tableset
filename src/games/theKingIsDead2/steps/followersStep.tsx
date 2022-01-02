import { $, Random, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { playersMetaStep } from "games/global";
import { allFactionCubes, ALL_FACTION_IDS, FactionId } from "../utils/Factions";
import { ALL_REGION_IDS } from "../utils/Regions";
import courtStep from "./courtStep";
import { NUM_CUBES_PER_HOME_REGION } from "./homeRegionStep";

const NUM_CUBES_PER_REGION = 4;

export default createRandomGameStep({
  id: "followers",
  dependencies: [playersMetaStep, courtStep],
  isTemplatable: (_players, court) => court.willResolve(),
  resolve: (_, playerIds, courtFactionIds) =>
    $(
      allFactionCubes(playerIds!.length),
      ($$) => Vec.diff($$, courtFactionIds!),
      ($$) =>
        Random.sample(
          $$,
          // Each region gets the same number of cubes
          ALL_REGION_IDS.length * NUM_CUBES_PER_REGION -
            // But we already put some cubes in the home regions
            ALL_FACTION_IDS.length * NUM_CUBES_PER_HOME_REGION
        ),
      Random.shuffle
    ),
  ...NoConfigPanel,
  InstanceVariableComponent,
  instanceAvroType: {
    type: "array",
    items: { type: "enum", name: "FollowerId", symbols: [...ALL_FACTION_IDS] },
  },
});

function InstanceVariableComponent({
  value: factionIds,
}: VariableStepInstanceComponentProps<readonly FactionId[]>): JSX.Element {
  return <></>;
}
