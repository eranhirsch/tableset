import { GameStepBase } from "./GameStepBase";
import { Product } from "./Product";

export type StepId = string;

export type ProductId = string;

export interface Game {
  readonly steps: readonly Readonly<GameStepBase>[];
  readonly products: Readonly<Record<ProductId, Product>>;
}
