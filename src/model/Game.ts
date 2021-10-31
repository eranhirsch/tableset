import { Dict } from "common";
import { GameId } from "games/core/GAMES";
import { GameStepBase } from "./GameStepBase";
import { Product } from "./Product";
import { VariableGameStep } from "./VariableGameStep";

export type StepId = string;

export type ProductId = string;

export interface GameOptions<Pid extends ProductId = ProductId> {
  id: GameId;
  name: string;
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  steps: readonly Readonly<GameStepBase>[];
  products: Readonly<Record<Pid, Product>>;
}

export interface Game<
  Sid extends StepId = StepId,
  Pid extends ProductId = ProductId
> {
  name: string;
  id: GameId;
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  steps: Readonly<Record<Sid, GameStepBase>>;
  products: Readonly<Record<Pid, Product>>;
}

export const createGame = <
  Sid extends StepId = StepId,
  Pid extends ProductId = ProductId
>({
  id,
  name,
  products,
  productsMetaStep,
  steps,
}: Readonly<GameOptions<Pid>>): Game<Sid, Pid> => ({
  id,
  name,
  products,
  productsMetaStep,
  steps: Dict.from_values(steps, ({ id }) => id),
});
