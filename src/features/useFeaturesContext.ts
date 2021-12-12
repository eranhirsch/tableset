import { useAppSelector } from "app/hooks";
import { ProductId } from "model/Game";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { allProductIdsSelector } from "./collection/collectionSlice";
import { gameSelector } from "./game/gameSlice";
import { playersSelectors } from "./players/playersSlice";

export interface ContextBase {
  playerIds: readonly PlayerId[];
  productIds: readonly ProductId[];
}

export function useFeaturesContext(): Readonly<ContextBase> {
  const game = useAppSelector(gameSelector);

  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];

  const productIds = useAppSelector(
    allProductIdsSelector(game)
  ) as readonly ProductId[];

  return useMemo(
    () => Object.freeze({ playerIds, productIds }),
    [playerIds, productIds]
  );
}
