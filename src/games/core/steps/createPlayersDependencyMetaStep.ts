import { PlayerId } from "../../../model/Player";
import IGameStep from "./IGameStep";

export const PLAYERS_DEPENDENCY_META_STEP_ID = "__players";

export default function createPlayersDependencyMetaStep({
  min = 1,
  // Unlikely that someone would have more than this number of players
  max = 9_999_999,
}: {
  min?: number;
  max?: number;
} = {}) {
  const playersMetaStep: IGameStep<readonly PlayerId[]> = {
    id: PLAYERS_DEPENDENCY_META_STEP_ID,
    label: "<Players>",

    hasValue: ({ playerIds }) =>
      playerIds.length >= min && playerIds.length <= max,

    extractInstanceValue: ({ playerIds }) => playerIds,

    isOptional: false,
  };
  return playersMetaStep;
}
