import { useAppSelector } from "app/hooks";
import { isGameSelectedSelector } from "features/game/gameSlice";
import { instanceSelectors } from "features/instance/instanceSlice";
import { playersSelectors } from "features/players/playersSlice";
import { Redirect } from "react-router-dom";

export function RootRedirector(): JSX.Element {
  const isGame = useAppSelector(isGameSelectedSelector);
  const playersCount = useAppSelector(playersSelectors.selectTotal);
  const instanceCount = useAppSelector(instanceSelectors.selectTotal);

  return (
    <Redirect
      to={
        !isGame
          ? "/games"
          : playersCount === 0
          ? "/players"
          : instanceCount === 0
          ? "/instance"
          : "/template"
      }
    />
  );
}
