import { GamePiecesColor } from "../../core/themeWithGameColors";
import IGameStep from "./steps/IGameStep";

export type StepId = string;

export default interface IGame {
  readonly playerColors: readonly GamePiecesColor[];
  readonly order: readonly StepId[];

  at(id: StepId): IGameStep<any> | undefined;
}
