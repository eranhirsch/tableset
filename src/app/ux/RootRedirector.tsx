import { useAppSelector } from "app/hooks";
import { expansionsTotalSelector } from "features/expansions/expansionsSlice";
import { instanceSelectors } from "features/instance/instanceSlice";
import { playersSelectors } from "features/players/playersSlice";
import { Redirect } from "react-router-dom";

export function RootRedirector(): JSX.Element {
  const playersCount = useAppSelector(playersSelectors.selectTotal);
  const productsCount = useAppSelector(expansionsTotalSelector);
  const instanceCount = useAppSelector(instanceSelectors.selectTotal);

  return (
    <Redirect
      to={
        playersCount === 0
          ? "/players"
          : productsCount === 0
          ? "/products"
          : instanceCount === 0
          ? "/instance"
          : "/template"
      }
    />
  );
}
