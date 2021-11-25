import { $ } from "common";
import { StepId } from "model/Game";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { InstanceUrlUtils } from "./InstanceUrlUtils";
import { useGameFromParam } from "./useGameFromParam";

export function useInstanceFromParam(): Readonly<Record<StepId, unknown>> {
  const { encodedInstance } = useParams();
  const game = useGameFromParam();

  return useMemo(
    () =>
      $(
        encodedInstance,
        $.nullthrows(`Missing 'encodedInstance' path param`),
        ($$) => InstanceUrlUtils.decode(game, $$)
      ),
    [game, encodedInstance]
  );
}
