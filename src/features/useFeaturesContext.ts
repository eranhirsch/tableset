import { useAppSelector } from "app/hooks";
import { ContextBase } from "model/ContextBase";
import { ProductId } from "model/Game";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { allExpansionIdsSelector } from "./expansions/expansionsSlice";
import { playersSelectors } from "./players/playersSlice";

export function useFeaturesContext(): Readonly<ContextBase> {
  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];
  const productIds = useAppSelector(
    allExpansionIdsSelector
  ) as readonly ProductId[];
  return useMemo(
    () => Object.freeze({ playerIds, productIds }),
    [playerIds, productIds]
  );
}
