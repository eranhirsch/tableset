import { PlayerId } from "../../../features/players/playersSlice";
import IGameStep from "./IGameStep";

export const PLAYERS_DEPENDENCY_META_STEP_ID = "__players";

type Limits =
  | {
      min: number;
      max?: number;
    }
  | {
      min?: number;
      max: number;
    };

export default function createPlayersDependencyMetaStep(limits: Limits) {
  const playersMetaStep: IGameStep<readonly PlayerId[]> = {
    id: PLAYERS_DEPENDENCY_META_STEP_ID,
    label: "<Players>",

    wouldTemplateGenerateValue: ({ playerIds }) =>
      playerIds.length >= (limits?.min ?? 0) &&
      // Unlikely that someone would have more than this number of players
      playerIds.length <= (limits?.max ?? 999999),

    extractInstanceValue: ({ playerIds }) => playerIds,
  };
  return playersMetaStep;
}
