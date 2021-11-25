import { $, base64Url, Dict } from "common";
import { StepId } from "model/Game";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGameFromParam } from "./useGameFromParam";

export function useInstanceFromParam(): Readonly<Record<StepId, unknown>> {
  const { encodedInstance } = useParams();
  const game = useGameFromParam();

  return useMemo(
    () =>
      $(
        encodedInstance,
        $.nullthrows(`Missing 'encodedInstance' path param`),
        ($$) => base64Url.decode($$),
        ($$) => game.instanceAvroType.fromBuffer($$),
        Dict.filter_nulls
      ),
    [game, encodedInstance]
  );
}
