import { useAppSelector } from "app/hooks";
import { useMemo } from "react";
import { allProductIdsSelector } from "./collection/collectionSlice";
import { gameSelector } from "./game/gameSlice";
import { ProductId } from "./instance/Game";
import { PlayerId, playersSelectors } from "./players/playersSlice";

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
