import { GamePiecesColor } from "../../core/themeWithGameColors";
import IGameStep from "./steps/IGameStep";

export type StepId = string;

export default interface IGame {
  readonly playerColors: readonly GamePiecesColor[];
  readonly steps: readonly IGameStep<unknown>[];

  at(id: StepId): IGameStep<unknown> | undefined;
}
