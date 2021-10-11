import { Dict } from "common";
import { GameStepBase } from "./GameStepBase";
import { Product } from "./Product";
import { VariableGameStep } from "./VariableGameStep";

export type StepId = string;

export type ProductId = string;

export interface GameOptions<Pid extends ProductId = ProductId> {
  readonly productsMetaStep: VariableGameStep<readonly Pid[]>;
  readonly steps: readonly Readonly<GameStepBase>[];
  readonly products: Readonly<Record<Pid, Product>>;
}

export interface Game<
  Sid extends StepId = StepId,
  Pid extends ProductId = ProductId
> {
  readonly productsMetaStep: VariableGameStep<readonly Pid[]>;
  readonly steps: Readonly<Record<Sid, GameStepBase>>;
  readonly products: Readonly<Record<Pid, Product>>;
}

export const createGame = <
  Sid extends StepId = StepId,
  Pid extends ProductId = ProductId
>({
  productsMetaStep,
  steps,
  products,
}: GameOptions<Pid>): Game<Sid, Pid> => ({
  products,
  productsMetaStep,
  steps: Dict.from_values(steps, ({ id }) => id),
});
