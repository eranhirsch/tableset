import avro from "avsc";
import { GameId } from "games/core/GAMES";
import { ProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";
import { GameStepBase } from "./GameStepBase";

export type StepId = string;

export type ProductId = string;

export interface Product {
  bggId: number;
  isBase?: true;
  name: string;
  year: number;
  isNotImplemented?: true;
}

export interface Game<
  Sid extends StepId = StepId,
  Pid extends ProductId = ProductId
> {
  name: string;
  id: GameId;
  productsMetaStep: ProductsMetaStep<Pid>;
  steps: Readonly<Record<Sid, GameStepBase>>;
  products: Readonly<Record<Pid, Product>>;

  instanceAvroType: avro.Type;
}
