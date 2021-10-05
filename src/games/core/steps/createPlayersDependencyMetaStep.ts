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
} = {}): Readonly<VariableGameStep<readonly PlayerId[]>> =>
  Object.freeze({
    id: PLAYERS_DEPENDENCY_META_STEP_ID,
    label: "<Players>",
    isOptional: false,

    hasValue: ({ playerIds }) =>
      playerIds.length >= min && playerIds.length <= max,

    extractInstanceValue: ({ playerIds }) => playerIds,
  });

export default createPlayersDependencyMetaStep;
