import { PlayerId } from "../../../model/Player";
import IGameStep from "../../../model/IGameStep";

export const PLAYERS_DEPENDENCY_META_STEP_ID = "__players";

const createPlayersDependencyMetaStep = ({
  min = 1,
  // Unlikely that someone would have more than this number of players
  max = 9_999_999,
}: {
  min?: number;
  max?: number;
} = {}): Readonly<IGameStep<readonly PlayerId[]>> =>
  Object.freeze({
    id: PLAYERS_DEPENDENCY_META_STEP_ID,
    label: "<Players>",

    hasValue: ({ playerIds }) =>
      playerIds.length >= min && playerIds.length <= max,

    extractInstanceValue: ({ playerIds }) => playerIds,

    isOptional: false,
  });

export default createPlayersDependencyMetaStep;
