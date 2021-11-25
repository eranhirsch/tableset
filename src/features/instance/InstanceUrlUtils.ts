import { $, base64Url, Dict } from "common";
import { Game, StepId } from "model/Game";

export const InstanceUrlUtils = {
  encode: (game: Game, instance: Readonly<Record<StepId, unknown>>) =>
    base64Url.encode(game.instanceAvroType.toBuffer(instance)),

  decode: (game: Game, encoded: string): Readonly<Record<StepId, unknown>> =>
    $(
      encoded,
      base64Url.decode,
      ($$) => game.instanceAvroType.fromBuffer($$),
      Dict.filter_nulls
    ),
} as const;
