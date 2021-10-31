import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { allProductIdsSelector } from "features/collection/collectionSlice";
import { gameSelector } from "features/game/gameSlice";
import { instanceSelectors } from "features/instance/instanceSlice";
import { playersSelectors } from "features/players/playersSlice";
import { Redirect } from "react-router-dom";

export function RootRedirector(): JSX.Element {
  const game = useAppSelector(gameSelector);
  const playersCount = useAppSelector(playersSelectors.selectTotal);
  const products = useAppSelector(allProductIdsSelector(game));
  const instanceCount = useAppSelector(instanceSelectors.selectTotal);

  return (
    <Redirect
      to={
        playersCount === 0
          ? "/players"
          : Vec.is_empty(products)
          ? "/products"
          : instanceCount === 0
          ? "/instance"
          : "/template"
      }
    />
  );
}
