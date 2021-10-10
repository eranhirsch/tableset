import { VariableGameStep } from "model/VariableGameStep";
import { PlayerId } from "../../../model/Player";

export const PLAYERS_DEPENDENCY_META_STEP_ID = "__players";

const createPlayersDependencyMetaStep = ({
  min = 1,
  // Unlikely that someone would have more than this number of players
  max = 9_999_999,
}: {
  min?: number;
  max?: number;
} = {}): Readonly<VariableGameStep<readonly PlayerId[]>> => ({
  id: PLAYERS_DEPENDENCY_META_STEP_ID,
  label: "<Players>",

  // trivial impl, these steps are never part of the template.
  coerceInstanceEntry: () => null,

  hasValue: ({ playerIds }) =>
    playerIds.length >= min && playerIds.length <= max,

  extractInstanceValue: ({ playerIds }) => playerIds,

  query: (_, { playerIds }) => ({
    canResolveTo: (_: readonly PlayerId[]) => false,
    willResolve: () => playerIds.length > 0,
    minCount: (min) => playerIds.length >= min,
    maxCount: (max) => playerIds.length <= max,
  }),
});

export default createPlayersDependencyMetaStep;
