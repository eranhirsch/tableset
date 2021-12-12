import avro from "avsc";
import { $, Dict, Vec } from "common";
import { GameId } from "games/core/GAMES";
import { GameStepBase } from "../features/instance/GameStepBase";
import { VariableGameStep } from "./VariableGameStep";

export type StepId = string;

export type ProductId = string;

interface Product {
  bggId: number;
  isBase?: true;
  name: string;
  year: number;
  isNotImplemented?: true;
}

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

  instanceAvroType: avro.Type;
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
}: Readonly<GameOptions<Pid>>): Game<Sid, Pid> =>
  $(
    steps,
    ($$) => Dict.from_values($$, ({ id }) => id),
    ($$) => ({
      id,
      name,
      products,
      productsMetaStep,
      steps: $$,
      instanceAvroType: buildTypeFromSteps(id, $$),
    })
  );

const buildTypeFromSteps = (
  gameId: GameId,
  steps: Readonly<Record<StepId, GameStepBase>>
): avro.Type =>
  $(
    steps,
    Dict.sort_by_key,
    ($$) => Dict.maybe_map($$, ({ instanceAvroType }) => instanceAvroType),
    ($$) =>
      Vec.map_with_key($$, (stepId, instanceAvroType) => ({
        name: stepId,
        type: ["null", instanceAvroType],
        default: null,
      })),
    ($$) =>
      avro.Type.forSchema({
        type: "record",
        name: "instance",
        namespace: gameId,
        // We spread the array we built because it is a readonly array and the
        // avro framework only accepts mutable arrays (although it shouldn't!)
        fields: [...$$],
      })
  );
