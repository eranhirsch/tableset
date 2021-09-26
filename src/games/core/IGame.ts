import GamePiecesColor from "model/GamePiecesColor";
import IGameStep from "./steps/IGameStep";

export type StepId = string;

export default interface IGame {
  readonly playerColors: readonly GamePiecesColor[];
  readonly steps: readonly Readonly<IGameStep<unknown>>[];

  atNullable(id: StepId): Readonly<IGameStep<unknown>> | undefined;
  atEnforce(id: StepId): Readonly<IGameStep<unknown>>;
}
