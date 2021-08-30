import { GamePiecesColor } from "../core/themeWithGameColors";
import { SetupStep } from "../features/instance/instanceSlice";
import IGameStep from "./IGameStep";

export type StepId = string;

export default interface IGame {
  readonly playerColors: readonly GamePiecesColor[];
  readonly order: readonly StepId[];

  at(id: StepId): IGameStep | undefined;
}
