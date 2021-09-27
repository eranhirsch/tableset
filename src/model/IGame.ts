import GamePiecesColor from "model/GamePiecesColor";
import { Product } from "./IExpansion";
import IGameStep from "./IGameStep";

export type StepId = string;

export type ProductId = string;

export default interface IGame {
  readonly playerColors: readonly GamePiecesColor[];
  readonly steps: readonly Readonly<IGameStep<unknown>>[];
  readonly products: Readonly<Record<ProductId, Product>>;

  atNullable(id: StepId): Readonly<IGameStep<unknown>> | undefined;
  atEnforce(id: StepId): Readonly<IGameStep<unknown>>;
}
