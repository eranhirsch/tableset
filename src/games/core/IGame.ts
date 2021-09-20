import GamePiecesColor from "model/GamePiecesColor";
import IGameStep from "./steps/IGameStep";

export type StepId = string;

export default interface IGame {
  readonly playerColors: readonly GamePiecesColor[];
  readonly steps: readonly IGameStep<unknown>[];

  atNullable(id: StepId): IGameStep<unknown> | undefined;
  atEnforce(id: StepId): IGameStep<unknown>;
}
